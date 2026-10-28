import { Snowflake } from 'lucide-react'
import './Brand.css'

function Brand({ compact = false }) {
  return (
    <div className={`brand${compact ? ' brand--compact' : ''}`}>
      <span className="brand__mark" aria-hidden="true">
        <Snowflake size={compact ? 20 : 25} strokeWidth={1.8} />
      </span>
      <span className="brand__copy">
        <strong>Refrigeração do Jair</strong>
        {!compact && <span>Assistência Técnica em Geral</span>}
      </span>
    </div>
  )
}

export default Brand