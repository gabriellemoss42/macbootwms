'use client'
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase"; // ajuste o caminho conforme seu projeto

type Produto = {
  id: string;
  codigo: string;
  nome: string;
  saldo?: number;
  estoque?: { saldoVirtualTotal?: number };
  prateleira?: string;
  updateTime?: string;
};

export default function Home() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [busca, setBusca] = useState("");

  useEffect(() => {
    async function fetchProdutos() {
      const querySnapshot = await getDocs(collection(db, "produtos"));
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Produto[];
      setProdutos(data);
    }
    fetchProdutos();
  }, []);

  const produtosFiltrados = produtos.filter(
    p =>
      p.nome?.toLowerCase().includes(busca.toLowerCase()) ||
      p.codigo?.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <main className="p-8">
      <h1 className="text-xl font-bold mb-4">Consulta de Estoque</h1>
      <input
        className="mb-4 p-2 border rounded w-full max-w-lg"
        type="text"
        placeholder="Buscar por nome ou código"
        value={busca}
        onChange={e => setBusca(e.target.value)}
      />
      <table className="min-w-full border border-collapse">
        <thead>
          <tr>
            <th className="border px-2 py-1">Código</th>
            <th className="border px-2 py-1">Nome</th>
            <th className="border px-2 py-1">Saldo</th>
            <th className="border px-2 py-1">Prateleira</th>
            <th className="border px-2 py-1">Última Movimentação</th>
          </tr>
        </thead>
        <tbody>
          {produtosFiltrados.map(prod => (
            <tr key={prod.id}>
              <td className="border px-2 py-1">{prod.codigo}</td>
              <td className="border px-2 py-1">{prod.nome}</td>
              <td className="border px-2 py-1">{prod.saldo ?? prod.estoque?.saldoVirtualTotal ?? 0}</td>
              <td className="border px-2 py-1">{prod.prateleira || "-"}</td>
              <td className="border px-2 py-1">{prod.updateTime || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
