import React, { useState } from 'react';
import axios from 'axios';
import './mainpage.css';

interface UTXOInput {
  txHash: string;
  index: number;
}

interface UTXO {
  input: UTXOInput;
  address: string;
  amount: string;
  confirmations: number;
  status: string;
}


const shortenAddress = (address: string) => {
    return `${address.substring(0, 8)}...${address.substring(address.length - 8)}`;
  };

const formatAmount = (amount: string) => {
    const num = parseFloat(amount);
    return num.toFixed(8);
  };

const UTXODisplay: React.FC = () => {
  const [utxoData, setUtxoData] = useState<UTXO[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedUTXOs, setSelectedUTXOs] = useState<UTXO[]>([]);

  const fetchUTXOData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post('http://localhost:3000/utxo');
      setUtxoData(response.data);
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Failed to fetch UTXO data');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };


  const handleSelect = (index:number) =>
  {
   const selectedUtxo = utxoData[index];
   setSelectedUTXOs(prev=>[...prev,selectedUtxo]);
   setUtxoData(prev => prev.filter((_, idx) => idx !== index));
  }

  const handleReturn = (index: number) => {
    const returnedUtxo = selectedUTXOs[index];
    setUtxoData(prev=>[...prev,returnedUtxo])
    setSelectedUTXOs(prev=>prev.filter((_,idx)=>idx!==index))
  };

  const mappedUtxo = utxoData.map((utxo, idx) => (
    <tr key={Date.now() + idx} className="table-row">
      <td className="table-cell address-cell">
        <span title={utxo.address}>
          {shortenAddress(utxo.address)}
          <button
            className="consolidate-button"
            onClick={() => handleSelect(idx)}
          >    Select for Consolidation
          </button>
        </span>
      </td>
      <td className="table-cell">{utxo.input.txHash}</td>
      <td className="table-cell">{utxo.input.index}</td>
      <td className="table-cell">{formatAmount(utxo.amount)}</td>
      <td className="table-cell">{utxo.confirmations.toLocaleString()}</td>
      <td className="table-cell">
        <span className={`status-badge ${
          utxo.status === 'AVAILABLE' ? 'status-available' : 'status-pending'
        }`}>
          {utxo.status}
        </span>
      </td>
    </tr>
  ));

  const selectedMappedUtxo = selectedUTXOs.map((utxo, idx) => (
    <tr key={Date.now() + idx} className="table-row">
      <td className="table-cell address-cell">
        <span title={utxo.address}>
          {shortenAddress(utxo.address)}
          <button
            className="consolidate-button"
            onClick={() => handleReturn(idx)}
          >
            Return to Pool
          </button>
        </span>
      </td>
      <td className="table-cell">{utxo.input.txHash}</td>
      <td className="table-cell">{utxo.input.index}</td>
      <td className="table-cell">{formatAmount(utxo.amount)}</td>
      <td className="table-cell">{utxo.confirmations.toLocaleString()}</td>
      <td className="table-cell">
        <span className={`status-badge ${
          utxo.status === 'AVAILABLE' ? 'status-available' : 'status-pending'
        }`}>
          {utxo.status}
        </span>
      </td>
    </tr>
  ));


  return (
    <div className="utxo-container">
      <button
        onClick={fetchUTXOData}
        className="fetch-button"
        disabled={loading}
      >
        {loading ? 'Loading...' : 'Fetch UTXO Data'}
      </button>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {loading && (
        <div className="loading-state loading-pulse">
          Loading UTXO data...
        </div>
      )}

    {utxoData.length > 0 && (
        <div className="utxo-card">
          <h2 className="card-title">Available UTXOs</h2>
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
                {mappedUtxo}
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
                  {formatAmount(selectedUTXOs.reduce((sum, utxo) => sum + parseFloat(utxo.amount), 0).toString())} BTC
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
          <button className="consolidate-button mt-4">
            Consolidate Selected UTXOs
          </button>
        </div>
      )}

      {!loading && utxoData.length === 0 && (
        <div className="empty-state">
          No UTXO data available
        </div>
      )}
    </div>
  );
};

export default UTXODisplay;