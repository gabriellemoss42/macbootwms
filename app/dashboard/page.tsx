'use client';
import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase'; // ajuste o caminho conforme seu projeto

type Produto = {
  id: string;
  codigo: string;
  nome: string;
  saldo?: number;
  estoque?: { saldoVirtualTotal?: number };
  prateleira?: string;
  updateTime?: string;
};

export default function DashboardEstoque() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [busca, setBusca] = useState('');

  useEffect(() => {
    async function fetchProdutos() {
      const querySnapshot = await getDocs(collection(db, 'produtos'));
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Produto[];
      setProdutos(data);
    }
    fetchProdutos();
  }, []);

  // Filtra para busca e para garantir que só linhas com código definido vão pro map
  const produtosFiltrados = produtos.filter(
    p =>
      p.codigo && (
        p.nome?.toLowerCase().includes(busca.toLowerCase()) ||
        p.codigo?.toLowerCase().includes(busca.toLowerCase())
      )
  );

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Consulta de Estoque</h1>
      <input
        className="mb-4 p-2 border rounded w-full max-w-lg"
        type="text"
        placeholder="Buscar por nome ou código"
        value={busca}
        onChange={e => setBusca(e.target.value)}
      />
      <div className="overflow-x-auto bg-white shadow rounded">
        <table className="min-w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-2 py-1">Código</th>
              <th className="border px-2 py-1">Nome</th>
              <th className="border px-2 py-1">Saldo</th>
              <th className="border px-2 py-1">Prateleira</th>
              <th className="border px-2 py-1">Última Mov.</th>
              <th className="border px-2 py-1">Copiar</th>
            </tr>
          </thead>
          <tbody>
            {produtosFiltrados.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-6 text-gray-400">
                  Nenhum produto encontrado.
                </td>
              </tr>
            )}
            {produtosFiltrados.map((prod) => (
              <tr key={prod.codigo} className="hover:bg-blue-50 transition">
                <td className="border px-2 py-1 font-mono">{prod.codigo}</td>
                <td className="border px-2 py-1">{prod.nome}</td>
                <td className="border px-2 py-1 font-bold text-right">
                  {prod.saldo ?? prod.estoque?.saldoVirtualTotal ?? 0}
                </td>
                <td className="border px-2 py-1">{prod.prateleira || '-'}</td>
                <td className="border px-2 py-1">
                  {prod.updateTime
                    ? new Date(prod.updateTime).toLocaleString('pt-BR')
                    : '-'}
                </td>
                <td className="border px-2 py-1">
                  <button
                    onClick={() => navigator.clipboard.writeText(prod.codigo)}
                    className="text-blue-600 hover:underline text-xs"
                  >
                    Copiar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 text-sm text-gray-600">
        Total de produtos: <b>{produtosFiltrados.length}</b>
      </div>
    </div>
  );
}
