import { useState, useEffect, useRef } from 'react';

/**
 * Search bar with fuzzy search and autocomplete
 */
export function SearchBar({ data, onSelectNode }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  // Simple fuzzy search function
  const fuzzySearch = (searchQuery) => {
    if (!searchQuery || searchQuery.length < 2) {
      return [];
    }

    const lowerQuery = searchQuery.toLowerCase();

    return data.nodes
      .map(node => {
        const name = node.name.toLowerCase();
        const description = node.description?.toLowerCase() || '';

        // Calculate match score
        let score = 0;

        // Exact match in name (highest priority)
        if (name === lowerQuery) {
          score = 1000;
        }
        // Starts with query
        else if (name.startsWith(lowerQuery)) {
          score = 500;
        }
        // Contains query in name
        else if (name.includes(lowerQuery)) {
          score = 300;
        }
        // Contains query in description
        else if (description.includes(lowerQuery)) {
          score = 100;
        }
        // Fuzzy match - check if all characters of query appear in order
        else {
          let queryIndex = 0;
          for (let i = 0; i < name.length && queryIndex < lowerQuery.length; i++) {
            if (name[i] === lowerQuery[queryIndex]) {
              queryIndex++;
              score += 10;
            }
          }
          if (queryIndex < lowerQuery.length) {
            score = 0; // Not all characters found
          }
        }

        return { node, score };
      })
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 8)
      .map(item => item.node);
  };

  // Update search results when query changes
  useEffect(() => {
    const matches = fuzzySearch(query);
    setResults(matches);
    setSelectedIndex(0);
    setIsOpen(matches.length > 0 && query.length >= 2);
  }, [query, data]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        inputRef.current &&
        !inputRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (!isOpen || results.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % results.length);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + results.length) % results.length);
        break;
      case 'Enter':
        e.preventDefault();
        if (results[selectedIndex]) {
          handleSelectNode(results[selectedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        inputRef.current?.blur();
        break;
      default:
        break;
    }
  };

  const handleSelectNode = (node) => {
    onSelectNode(node);
    setQuery('');
    setIsOpen(false);
    inputRef.current?.blur();
  };

  return (
    <div style={styles.container}>
      <div style={styles.searchBox}>
        <span style={styles.searchIcon}>🔍</span>
        <input
          ref={inputRef}
          type="text"
          placeholder="Search concepts..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => query.length >= 2 && setIsOpen(true)}
          style={styles.input}
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setIsOpen(false);
            }}
            style={styles.clearButton}
          >
            ×
          </button>
        )}
      </div>

      {isOpen && results.length > 0 && (
        <div ref={dropdownRef} style={styles.dropdown}>
          {results.map((node, index) => (
            <div
              key={node.id}
              onClick={() => handleSelectNode(node)}
              onMouseEnter={() => setSelectedIndex(index)}
              style={{
                ...styles.resultItem,
                ...(index === selectedIndex ? styles.resultItemSelected : {})
              }}
            >
              <div style={styles.resultName}>{node.name}</div>
              <div style={styles.resultMeta}>
                <span style={styles.resultEra}>
                  {node.era < 0 ? `${Math.abs(node.era)} BCE` : `${node.era} CE`}
                </span>
                <span style={styles.resultDomain}>
                  {node.domains.includes('philosophy') && node.domains.includes('politics')
                    ? 'Philosophy + Politics'
                    : node.domains.includes('politics')
                    ? 'Politics'
                    : 'Philosophy'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    position: 'relative',
    width: '300px'
  },
  searchBox: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#0f3460',
    borderRadius: '8px',
    border: '2px solid #34495e',
    transition: 'all 0.3s ease'
  },
  searchIcon: {
    fontSize: '16px',
    padding: '0 12px',
    color: '#95a5a6'
  },
  input: {
    flex: 1,
    padding: '10px 8px',
    backgroundColor: 'transparent',
    border: 'none',
    outline: 'none',
    color: '#eaeaea',
    fontSize: '14px',
    fontFamily: 'inherit'
  },
  clearButton: {
    padding: '0 12px',
    background: 'none',
    border: 'none',
    fontSize: '24px',
    color: '#95a5a6',
    cursor: 'pointer',
    lineHeight: '1',
    transition: 'color 0.2s'
  },
  dropdown: {
    position: 'absolute',
    top: 'calc(100% + 8px)',
    left: 0,
    right: 0,
    backgroundColor: '#16213e',
    borderRadius: '8px',
    border: '2px solid #34495e',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5)',
    maxHeight: '400px',
    overflowY: 'auto',
    zIndex: 1000
  },
  resultItem: {
    padding: '12px 16px',
    cursor: 'pointer',
    borderBottom: '1px solid #0f3460',
    transition: 'background-color 0.2s'
  },
  resultItemSelected: {
    backgroundColor: '#0f3460'
  },
  resultName: {
    fontSize: '15px',
    fontWeight: 'bold',
    color: '#3498db',
    marginBottom: '4px'
  },
  resultMeta: {
    display: 'flex',
    gap: '12px',
    fontSize: '12px'
  },
  resultEra: {
    color: '#95a5a6'
  },
  resultDomain: {
    color: '#bdc3c7'
  }
};
