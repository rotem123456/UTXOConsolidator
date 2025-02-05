import { UTXO} from "./UTXO";


export function shortenAddress(address: string)
{
  return `${address.substring(0, 8)}...${address.substring(address.length - 8)}`;
}

export function formatAmounts(amount:string)
{
  return parseFloat(amount).toFixed(8);
}

export function sortByAmount(_utxo:Array<UTXO>)
{
  return  _utxo.sort((a,b)=> Number(b.amount)-Number(a.amount))
}

 export function mapRelevantUTXO(
  _utxo: any,
  text: string,
  handleClick: (idx: number) => void,
  keyPrefix: string = '',
  sortFunction?:(utxo: Array<UTXO>)=>Array<UTXO>){
    const mappedUTXO = sortFunction? sortFunction(_utxo): _utxo
    return mappedUTXO?.map((utxo: any, idx: number) => (
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
        <td className="table-cell">{formatAmounts(utxo.amount)}</td>
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

export function sendTxInputs(_utxo:Array<UTXO>):any
{
  return _utxo.map
  ((mappedUtxoOBJ)=>{
    return {
      txHash:mappedUtxoOBJ.input.txHash,
      index: mappedUtxoOBJ.input.index,
    }
  })
}