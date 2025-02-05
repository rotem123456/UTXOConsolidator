import React, { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import './mainpage.css';
import { mapRelevantUTXO,formatAmounts,sortByAmount,sendTxInputs } from '../utils/utils';
import { UTXO } from '../utils/UTXO';

const UTXODisplay: React.FC = () => {
  const [utxoData, setUtxoData] = useState<UTXO[]>([]);
  const [selectedUTXOs, setSelectedUTXOs] = useState<UTXO[]>([]);
  const [vaultId, setVaultId] = useState('');
  const [assetId, setAssetId] = useState('');
  const [sort,setSort] = useState(false);

  const {isFetched,isFetching, isError, error, refetch } = useQuery({
    queryKey: ['utxo', vaultId, assetId],
    queryFn: async () => {
      const response = await fetch('http://localhost:3000/utxo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vaultId, assetId }),
      });

      if (!response.ok) throw new Error('Could not connect to BE, Check if BE container is up');
      if(isError) console.log(error)
      const data =  await response.json();
      setUtxoData(data);
      return data;
    },
    enabled: false,
  });

  const sendTX = useMutation({
    mutationKey: ['transaction', vaultId, assetId],
    mutationFn: async (selectedMappedUtxo: Array<UTXO>) => {
      console.log('Sending UTXOs:', selectedMappedUtxo); // Debug log

      const response = await fetch('http://localhost:3000/createTransaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ selectedMappedUtxo }),
      });

      const data = await response.json();
      console.log('Response:', data); // Debug log
      return data;
    },
    onError: (error) => {
      console.error('Mutation error:', error); // Debug log
    }
});


  const handleSort = () =>
  {
    setSort(!sort)
  }

  const handleSelect = (index: number) => {
    const selectedUtxo = utxoData[index];
    setSelectedUTXOs(prev => [...prev, selectedUtxo]);
    setUtxoData(prev => prev.filter((_, idx) => idx !== index));
  };

  const handleReturn = (index: number) => {
    const returnedUtxo = selectedUTXOs[index];
    setUtxoData(prev => [...prev, returnedUtxo]);
    setSelectedUTXOs(prev => prev.filter((_, idx) => idx !== index));
  }

const selectedMappedUtxo = mapRelevantUTXO(selectedUTXOs, "Return to Pool", handleReturn, "selected");

  return (
    <div className="utxo-container">
    <form
      className="input-container mb-4 flex gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        refetch();
      }}
    >
      <div className="input-group">
        <label htmlFor="vaultId" className="block text-sm font-medium text-gray-700 mb-1">
          VaultId
        </label>
        <input
          type="text"
          id="vaultId"
          value={vaultId}
          onChange={(e) => setVaultId(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md shadow-sm"
        />
      </div>
      <div className="input-group">
        <label htmlFor="assetId" className="block text-sm font-medium text-gray-700 mb-1">
          AssetId
        </label>
        <input
          type="text"
          id="assetId"
          value={assetId}
          onChange={(e) => setAssetId(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md shadow-sm"
        />
      </div>
      <button
        type="submit"
        className="fetch-button"
        disabled={isFetching}
      >
        {isFetching ? 'Loading' : 'Fetch UTXO'}
      </button>
    </form>

    {isError && (
      <div className="error-message">
        Error: {error.message}
      </div>
    )}

      {utxoData.length > 0 && (
        <div className="utxo-card">
          <h2 className="card-title">

            Available UTXOs</h2>
          <div className="table-container">
          <button className="fetch-button" onClick={()=>handleSort()}>Sort</button>
            <table className="utxo-table">
              <thead className="table-header">
                <tr>
                  <th>Address</th>
                  <th>Hash</th>
                  <th>Index</th>
                  <th>Amount {assetId}</th>
                  <th>Confirmations</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
              {mapRelevantUTXO(
              utxoData,
              "Select for Consolidation",
              handleSelect,
              '',
              sort ? sortByAmount : undefined)}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selectedUTXOs.length > 0 && (
        <div className="utxo-card mt-4">
          <h2 className="card-title">Selected for Consolidation</h2>
          <div className="summary-section">
            <h3 className="summary-title">Consolidation Summary</h3>
            <div className="summary-grid">
              <div className="summary-item">
                <p className="summary-label">Selected UTXOs</p>
                <p className="summary-value">{selectedUTXOs.length}</p>
              </div>
              <div className="summary-item">
                <p className="summary-label">Total Amount</p>
                <p className="summary-value">
                  {formatAmounts(selectedUTXOs.reduce((sum, utxo) => sum + parseFloat(utxo.amount), 0).toString())}
                </p>
              </div>
            </div>
          </div>
          <div className="table-container">
            <table className="utxo-table">
              <thead className="table-header">
                <tr>
                  <th>Address</th>
                  <th>Hash</th>
                  <th>Index</th>
                  <th>Amount (BTC)</th>
                  <th>Confirmations</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {selectedMappedUtxo}
              </tbody>
            </table>
          </div>
          <button
          className="consolidate-button mt-4"
          onClick={()=>{sendTX.mutate(sendTxInputs(selectedUTXOs))}}>
            Consolidate Selected UTXOs
          </button>
        </div>
      )}

      {!isFetched && utxoData.length === 0 && (
        <div className="empty-state">
          No UTXO data available
        </div>
      )}
    </div>
  );
};

export default UTXODisplay;