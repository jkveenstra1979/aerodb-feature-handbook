"use client";

import { useMemo, useState } from 'react';
import type { Feature } from '@/types/feature';

type Props = {
  features: Feature[];
};

const tabs = [
  'Attributen',
  'Relaties',
  'AIXM Mapping',
  'Data-eigenaarschap',
  'ADIS afhankelijkheden',
];

export function FeatureExplorer({ features }: Props) {
  const [search, setSearch] = useState('');
  const [moduleFilter, setModuleFilter] = useState<'all' | 'nav' | 'apt' | 'air' | 'obs'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'aixm' | 'easa'>('all');
  const [activeTab, setActiveTab] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(features[0]?.id ?? null);

  const filteredFeatures = useMemo(() => {
    const term = search.trim().toLowerCase();
    return features.filter((f) => {
      const matchesSearch =
        !term ||
        f.name.toLowerCase().includes(term) ||
        f.code.toLowerCase().includes(term) ||
        f.attrs.some((a) => a.name.toLowerCase().includes(term));

      const matchesModule =
        moduleFilter === 'all' ||
        (moduleFilter === 'nav' && f.group.toLowerCase().includes('navig')) ||
        (moduleFilter === 'apt' && f.group.toLowerCase().includes('luchthaven')) ||
        (moduleFilter === 'air' && f.group.toLowerCase().includes('luchtruim')) ||
        (moduleFilter === 'obs' && f.group.toLowerCase().includes('obstakel'));

      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'aixm' && f.aixmMapped) ||
        (statusFilter === 'easa' && f.badges.some((b) => b.toLowerCase().includes('easa')));

      return matchesSearch && matchesModule && matchesStatus;
    });
  }, [features, moduleFilter, search, statusFilter]);

  const selected = filteredFeatures.find((f) => f.id === selectedId) ?? filteredFeatures[0] ?? null;

  return (
    <>
      <header>
        <div className="logo">AeroDB <span>Feature Handbook</span></div>
        <span className="version-badge">Prototype · Next.js + Supabase</span>
        <div className="spacer" />
        <div className="header-actions">
          <button
            className="btn-export"
            onClick={() => alert('Export naar PDF/CSV — binnenkort via server action')}
          >
            ↓ Exporteer
          </button>
        </div>
      </header>

      <div className="layout">
        <aside>
          <div className="search-wrap">
            <input
              className="search-input"
              type="search"
              placeholder="Zoek feature of attribuut…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="filter-section">
            <div className="filter-label">Filter op module</div>
            <div className="filter-tags">
              {[
                ['all', 'Alles'],
                ['nav', 'Navigatie'],
                ['apt', 'Luchthaven'],
                ['air', 'Luchtruim'],
                ['obs', 'Obstakels'],
              ].map(([val, label]) => (
                <div
                  key={val}
                  className={`filter-tag ${moduleFilter === val ? 'active' : ''}`}
                  onClick={() => setModuleFilter(val as typeof moduleFilter)}
                >
                  {label}
                </div>
              ))}
            </div>
          </div>

          <div className="filter-section">
            <div className="filter-label">Filter op status</div>
            <div className="filter-tags">
              {[
                ['all', 'Alles'],
                ['aixm', 'AIXM mapped'],
                ['easa', 'EASA vereist'],
              ].map(([val, label]) => (
                <div
                  key={val}
                  className={`filter-tag ${statusFilter === val ? 'active' : ''}`}
                  onClick={() => setStatusFilter(val as typeof statusFilter)}
                >
                  {label}
                </div>
              ))}
            </div>
          </div>

          <div className="feature-list" id="featureList">
            {filteredFeatures.map((f) => (
              <div
                key={f.id}
                className={`feature-item ${selected?.id === f.id ? 'active' : ''}`}
                onClick={() => {
                  setSelectedId(f.id);
                  setActiveTab(0);
                }}
              >
                <div className={`feature-icon ${f.iconClass}`}>{f.code}</div>
                <div className="feature-meta">
                  <div className="feature-name">{f.name}</div>
                  <div className="feature-sub">{f.attrs.length} attributen</div>
                </div>
                {f.aixmMapped && <div className="aixm-dot" title="AIXM 5.1 gemapped" />}
              </div>
            ))}
            {!filteredFeatures.length && (
              <div className="empty-state" style={{ padding: 12 }}>
                <h2>Geen resultaten</h2>
                <p style={{ fontSize: 12 }}>Pas filters of zoekterm aan.</p>
              </div>
            )}
          </div>
        </aside>

        <main>
          <div className="main-inner" id="mainContent">
            {!selected && (
              <div className="empty-state">
                <h2>Selecteer een feature</h2>
                <p>Kies een feature uit de lijst aan de linkerkant.</p>
              </div>
            )}

            {selected && (
              <>
                <div className="feature-header">
                  <div className="feature-header-top">
                    <div
                      className={`feature-icon ${selected.iconClass}`}
                      style={{ width: 40, height: 40, fontSize: 14 }}
                    >
                      {selected.code}
                    </div>
                    <div className="feature-title">
                      <h1>{selected.name}</h1>
                      <div className="feature-code">AeroDB · ADIS · {selected.group}</div>
                      <div className="feature-badges">
                        {selected.badges.map((b) => {
                          const cls = b.includes('AIXM')
                            ? 'badge-aixm'
                            : b.includes('ADIS')
                              ? 'badge-adis'
                              : 'badge-easa';
                          return (
                            <span className={`badge ${cls}`} key={b}>
                              {b}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                  <div className="feature-desc">{selected.description}</div>
                </div>

                <div className="tabs">
                  {tabs.map((t, i) => (
                    <div
                      key={t}
                      className={`tab ${activeTab === i ? 'active' : ''}`}
                      onClick={() => setActiveTab(i)}
                    >
                      {t}
                      <span className="tab-count">{tabCount(selected, i)}</span>
                    </div>
                  ))}
                </div>

                <div className="tab-panel">{renderTab(selected, activeTab)}</div>
              </>
            )}
          </div>
        </main>
      </div>
    </>
  );
}

function tabCount(f: Feature, tab: number) {
  switch (tab) {
    case 0:
      return f.attrs.length;
    case 1:
      return Object.values(f.relations).flat().length;
    case 2:
      return f.mapping.length;
    case 3:
      return f.ownership.length;
    case 4:
      return f.adis.length;
    default:
      return 0;
  }
}

function renderTab(f: Feature, tab: number) {
  switch (tab) {
    case 0:
      return renderAttrs(f);
    case 1:
      return renderRelations(f);
    case 2:
      return renderMapping(f);
    case 3:
      return renderOwnership(f);
    case 4:
      return renderADIS(f);
    default:
      return null;
  }
}

function renderAttrs(f: Feature) {
  return (
    <>
      <table className="attr-table">
        <thead>
          <tr>
            <th>Attribuut</th>
            <th>Type</th>
            <th>Status</th>
            <th>Beschrijving</th>
            <th>UOM</th>
            <th>AIXM 5.1</th>
          </tr>
        </thead>
        <tbody>
          {f.attrs.map((a) => (
            <tr key={a.name}>
              <td><span className="attr-name">{a.name}</span></td>
              <td><span className="attr-type">{a.type}</span></td>
              <td style={{ fontSize: 12 }}>{renderStatus(a.status)}</td>
              <td style={{ fontSize: 12, color: 'var(--muted)' }}>{a.desc}</td>
              <td style={{ fontSize: 11, color: 'var(--muted)' }}>{a.uom ?? '—'}</td>
              <td>{renderAixm(a.aixm)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="legend">
        <div className="legend-item"><span className="status-req" /> Verplicht</div>
        <div className="legend-item"><span className="status-opt" /> Optioneel</div>
        <div className="legend-item"><span className="status-cond" /> Conditioneel</div>
        <div className="legend-item" style={{ marginLeft: 'auto', color: 'var(--faint)' }}>
          {f.attrs.filter((a) => a.aixm === null).length} IDS niet-standaard attributen
        </div>
      </div>
    </>
  );
}

function renderStatus(status: Feature['attrs'][number]['status']) {
  if (status === 'req') return (<><span className="status-req" />Verplicht</>);
  if (status === 'opt') return (<><span className="status-opt" />Optioneel</>);
  return (<><span className="status-cond" />Conditioneel</>);
}

function renderAixm(aixm: string | null) {
  if (aixm) return <span className="mapping-aixm" style={{ fontSize: 11 }}>{aixm}</span>;
  return <span style={{ color: 'var(--faint)', fontSize: 11 }}>— IDS only</span>;
}

function renderRelations(f: Feature) {
  const { parent, children, spatial, logical } = f.relations;
  return (
    <div className="relations-grid">
      {relationSection('Parent features', parent, '↑')}
      {relationSection('Child features', children, '↓')}
      {relationSection('Ruimtelijke relaties', spatial, '⊕')}
      {relationSection('Logische afhankelijkheden', logical, '→')}
    </div>
  );
}

function relationSection(title: string, items: Feature['relations']['parent'], arrow: string) {
  if (!items?.length) {
    return (
      <div className="relation-group">
        <div className="relation-group-title">{title}</div>
        <div style={{ fontSize: 12, color: 'var(--faint)' }}>Geen</div>
      </div>
    );
  }
  return (
    <div className="relation-group">
      <div className="relation-group-title">{title}</div>
      {items.map((i) => (
        <div className="relation-item" key={`${title}-${i.name}-${i.label}`}>
          <span className="relation-arrow">{arrow}</span>
          <span className="relation-name">{i.name}</span>
          <span className="relation-label">{i.label}</span>
        </div>
      ))}
    </div>
  );
}

function renderMapping(f: Feature) {
  return (
    <>
      <div className="mapping-row header">
        <div className="mapping-cell">AeroDB attribuut</div>
        <div className="mapping-cell">AIXM 5.1 equivalent</div>
        <div className="mapping-cell">DB tabel · kolom</div>
      </div>
      {f.mapping.map((m) => (
        <div className="mapping-row" key={`${m.aerodb}-${m.column}`}>
          <div className="mapping-cell"><span className="mapping-aerodb">{m.aerodb}</span></div>
          <div className="mapping-cell"><span className="mapping-aixm">{m.aixm}</span></div>
          <div className="mapping-cell"><span className="mapping-db">{m.table}.{m.column}</span></div>
        </div>
      ))}
    </>
  );
}

function renderOwnership(f: Feature) {
  return (
    <table className="ownership-table">
      <thead>
        <tr>
          <th>Attribuut</th>
          <th>Dataleverancier</th>
          <th>Data Originator</th>
          <th>DPA</th>
        </tr>
      </thead>
      <tbody>
        {f.ownership.map((o) => (
          <tr key={o.attr}>
            <td><span className="attr-name">{o.attr}</span></td>
            <td><span className="owner-tag">{o.provider}</span></td>
            <td><span className="owner-tag">{o.originator}</span></td>
            <td>{o.dpa ? <span className="badge badge-easa">DPA bijlage</span> : <span style={{ color: 'var(--faint)', fontSize: 12 }}>—</span>}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function renderADIS(f: Feature) {
  return (
    <div className="adis-grid">
      {f.adis.map((m) => (
        <div className="adis-module" key={m.module}>
          <div className="adis-module-name">{m.module}</div>
          <div className="adis-attrs">
            {m.attrs.map((a) => (
              <div className="adis-attr" key={`${m.module}-${a}`}>
                <span className="adis-req-dot" />
                {a}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
