'use client'
import { useState, useEffect } from "react";
import { collection, getDocs, addDoc, doc, updateDoc, increment } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { Box, TextField, Button, Typography, Paper, Table, TableBody, TableRow, TableCell, TableHead, IconButton } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';

export default function EntradaEmMassa() {
  const [produtos, setProdutos] = useState([]);
  const [barcode, setBarcode] = useState("");
  const [lista, setLista] = useState([]); // [{gtin, nome, idBling, quantidade}]
  const [endereco, setEndereco] = useState("");

  // Carrega produtos sincronizados do Bling/ERP
  useEffect(() => {
    async function fetchProdutos() {
      const snap = await getDocs(collection(db, "produtos"));
      setProdutos(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }
    fetchProdutos();
  }, []);

  // Ao digitar (ou ler) o código de barras e pressionar Enter
  const handleAdd = (e) => {
    e.preventDefault();
    if (!barcode) return;
    const produto = produtos.find(p => p.codigo === barcode || p.gtin === barcode);
    if (!produto) {
      alert("Produto não encontrado!");
      setBarcode("");
      return;
    }
    setLista(old => {
      const found = old.find(l => l.gtin === produto.gtin);
      if (found) {
        return old.map(l => l.gtin === produto.gtin ? { ...l, quantidade: l.quantidade + 1 } : l);
      }
      return [...old, { gtin: produto.gtin, nome: produto.nome, idBling: produto.idBling, quantidade: 1 }];
    });
    setBarcode("");
  };

  // Remover linha
  const handleDelete = (gtin) => setLista(lista.filter(l => l.gtin !== gtin));

  // Alterar quantidade manual
  const handleChangeQtd = (gtin, value) => {
    setLista(lista.map(l =>
      l.gtin === gtin ? { ...l, quantidade: Math.max(1, Number(value)) } : l
    ));
  };

  // Lançar todas as entradas de uma vez
  const handleLancar = async () => {
    if (!endereco) { alert("Informe o endereço!"); return; }
    if (lista.length === 0) { alert("Adicione ao menos um produto!"); return; }
    for (const item of lista) {
      // Atualiza saldo no estoque
      const estoqueDoc = doc(db, "estoque", `${item.gtin}_${endereco}`);
      await updateDoc(estoqueDoc, {
        produtoId: item.gtin,
        endereco: endereco,
        quantidade: increment(item.quantidade),
        atualizadoEm: new Date()
      }).catch(async () => {
        await addDoc(collection(db, "estoque"), {
          produtoId: item.gtin,
          endereco,
          quantidade: item.quantidade,
          atualizadoEm: new Date()
        });
      });

      // Salva movimentação
      await addDoc(collection(db, "movimentacoes"), {
        tipo: "entrada",
        produtoId: item.gtin,
        produto: item.nome,
        quantidade: item.quantidade,
        endereco,
        data: new Date(),
        usuario: "usuarioExemplo"
      });

      // Integração Bling
      fetch("/api/integracao-erp-entrada", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          produto: { id: item.idBling, codigo: item.gtin },
          deposito: { id: 123456 }, // ID do depósito no Bling
          operacao: "E",
          quantidade: item.quantidade,
          observacoes: "Entrada em massa via WMS"
        })
      });
    }
    alert("Entradas lançadas com sucesso!");
    setLista([]);
    setEndereco("");
  };

  return (
    <Box maxWidth={650} margin="auto" mt={4}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" fontWeight="bold" mb={2}>Entrada em Massa (Leitura de código de barras)</Typography>
        <form onSubmit={handleAdd} style={{ display: "flex", gap: 8, marginBottom: 18 }}>
          <TextField
            label="Código de Barras ou GTIN"
            value={barcode}
            onChange={e => setBarcode(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") handleAdd(e); }}
            autoFocus
          />
          <Button variant="contained" onClick={handleAdd}>Adicionar</Button>
        </form>
        <TextField
          label="Endereço*"
          value={endereco}
          onChange={e => setEndereco(e.target.value)}
          fullWidth
          required
          margin="normal"
        />
        <Table size="small" sx={{ mt: 2 }}>
          <TableHead>
            <TableRow>
              <TableCell>GTIN</TableCell>
              <TableCell>Produto</TableCell>
              <TableCell>Quantidade</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {lista.map(l => (
              <TableRow key={l.gtin}>
                <TableCell>{l.gtin}</TableCell>
                <TableCell>{l.nome}</TableCell>
                <TableCell>
                  <TextField
                    type="number"
                    value={l.quantidade}
                    onChange={e => handleChangeQtd(l.gtin, e.target.value)}
                    inputProps={{ min: 1, style: { width: 60 } }}
                  />
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleDelete(l.gtin)}><DeleteIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
          onClick={handleLancar}
          disabled={!endereco || lista.length === 0}
        >
          Lançar Entradas
        </Button>
      </Paper>
    </Box>
  );
}
