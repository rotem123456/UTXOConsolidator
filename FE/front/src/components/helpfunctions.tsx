export const shortenAddress = (address: string) => {
  return `${address.substring(0, 8)}...${address.substring(address.length - 8)}`;
};
export const formatAmount = (amount: string) => {
  const num = parseFloat(amount);
  return num.toFixed(8);
};


 export function mapRelevantUTXO(_utxo: any, text: string, handleClick: (idx: number) => void, keyPrefix: string = '') {
    return _utxo.map((utxo: any, idx: number) => (
      <tr key={`${keyPrefix}-${utxo.input.txHash}-${idx}`} className="table-row">
        <td className="table-cell address-cell">
          <span title={utxo.address}>
            {shortenAddress(utxo.address)}
            <button
              className="consolidate-button"
              onClick={() => handleClick(idx)}
            >
              {text}
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
  }