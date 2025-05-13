import React from 'react';
import './FeedbackTable.css';

interface FeedbackTableProps {
  markdownText: string;
}

const FeedbackTable: React.FC<FeedbackTableProps> = ({ markdownText }) => {
  // Function to extract and render markdown table
  const renderMarkdownTable = () => {
    try {
      // Extract the table section from the markdown text
      // This regex looks for a table pattern with | characters
      const tableSection = markdownText.match(/\| Criterion \|[\s\S]*?(?=\n\n|$)/);

      if (!tableSection) {
        console.log("No table section found in the feedback text");
        return null;
      }

      const tableText = tableSection[0];
      const tableRows = tableText.split('\n').filter(row => row.trim().startsWith('|'));

      if (tableRows.length < 3) {
        console.log("Table doesn't have enough rows");
        return null;
      }

      // Extract header row (first row)
      const headerRow = tableRows[0]
        .split('|')
        .filter(cell => cell.trim() !== '')
        .map(cell => cell.trim());

      // Skip the separator row (second row)

      // Extract data rows (remaining rows)
      const dataRows = tableRows.slice(2).map(row =>
        row.split('|')
          .filter(cell => cell.trim() !== '')
          .map(cell => cell.trim())
      );

      return (
        <table className="feedback-metrics-table">
          <thead>
            <tr>
              {headerRow.map((header, index) => (
                <th key={index}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dataRows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      );
    } catch (error) {
      console.error("Error rendering markdown table:", error);
      return null;
    }
  };

  return (
    <div className="feedback-table">
      {renderMarkdownTable()}
    </div>
  );
};

export default FeedbackTable;
