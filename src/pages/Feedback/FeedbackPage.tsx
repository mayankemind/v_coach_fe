import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import axiosInstance from '../../config/axiosConfig';
import FeedbackTable from '../../components/FeedbackTable/FeedbackTable';
import './FeedbackPage.css';

// Try to import ReactMarkdown, but provide a fallback if it's not available
let ReactMarkdown: React.ComponentType<{ children: string }>;
try {
  ReactMarkdown = (await import('react-markdown')).default;
} catch (e) {
  // Fallback component if react-markdown is not available
  ReactMarkdown = ({ children }: { children: string }) => (
    <div style={{ whiteSpace: 'pre-wrap' }}>{children}</div>
  );
}

// Interface for feedback response
interface FeedbackResponse {
  session_id: string;
  specialty: string;
  nature: string;
  gender: string;
  final_status: string;
  product_name: string;
  score: number;
  feedback_generated: boolean;
  llm_feedback_text: string;
  certification_eligible: boolean;
  certification_level: string;
  per_message_violations_logged: any[];
}

const FeedbackPage: React.FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState<FeedbackResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState('');

  useEffect(() => {
    const fetchFeedback = async () => {
      if (!sessionId) {
        setError('Session ID is missing');
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError('');

      try {
        console.log('Fetching feedback for session ID:', sessionId);
        const response = await axiosInstance.get<FeedbackResponse>(`/chats/${sessionId}/feedback`);
        console.log('Feedback response:', response.data);
        setFeedback(response.data);
      } catch (err) {
        console.error('Failed to fetch feedback:', err);
        setError('Failed to load feedback. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeedback();
  }, [sessionId]);

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  // Function to refresh feedback data
  const handleRefreshFeedback = () => {
    if (!sessionId) {
      setError('Session ID is missing');
      return;
    }

    setIsLoading(true);
    setError('');

    const fetchFeedback = async () => {
      try {
        console.log('Refreshing feedback for session ID:', sessionId);
        const response = await axiosInstance.get<FeedbackResponse>(`/chats/${sessionId}/feedback`);
        console.log('Refreshed feedback response:', response.data);
        setFeedback(response.data);
      } catch (err) {
        console.error('Failed to refresh feedback:', err);
        setError('Failed to load feedback. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeedback();
  };

  // Function to download certificate
  const handleDownloadCertificate = async () => {
    if (!sessionId) return;

    setIsDownloading(true);
    setDownloadError('');

    try {
      console.log(`Downloading certificate for session: ${sessionId}`);
      const response = await axiosInstance.get(`/chats/${sessionId}/certificate/download`, {
        responseType: 'blob'
      });

      // Create a blob URL and trigger download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;

      // Try to get filename from content-disposition header, or use default
      const contentDisposition = response.headers['content-disposition'];
      const filename = contentDisposition
        ? contentDisposition.split('filename=')[1].replace(/"/g, '')
        : `certificate-${sessionId}.pdf`;

      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();

      // Clean up
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
    } catch (err: any) {
      console.error('Failed to download certificate:', err);

      let errorMessage = 'Failed to download certificate. Please try again later.';

      if (err.response) {
        // Server responded with an error
        if (err.response.status === 404) {
          errorMessage = 'Certificate not found. Please contact support.';
        } else if (err.response.status === 403) {
          errorMessage = 'You do not have permission to download this certificate.';
        } else if (err.response.data && err.response.data.detail) {
          errorMessage = `Error: ${err.response.data.detail}`;
        }
        console.error('Error response:', err.response.status, err.response.data);
      } else if (err.request) {
        // No response received
        errorMessage = 'No response from server. Please check your connection and try again.';
        console.error('No response received:', err.request);
      }

      setDownloadError(errorMessage);
    } finally {
      setIsDownloading(false);
    }
  };

  // Function to render stars based on score
  const renderStars = (score: number) => {
    const fullStars = Math.floor(score);
    const hasHalfStar = score % 1 >= 0.5;
    const stars = [];

    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={`full-${i}`} className="star full">★</span>);
    }

    if (hasHalfStar) {
      stars.push(<span key="half" className="star half">★</span>);
    }

    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<span key={`empty-${i}`} className="star empty">☆</span>);
    }

    return stars;
  };



  return (
    <div className="feedback-page">
      <Header />
      <div className="feedback-container">
        <div className="feedback-header">
          <h1>Performance Feedback</h1>
        </div>

        {isLoading ? (
          <div className="feedback-loading">
            <div className="loading-spinner"></div>
            <p>Loading feedback...</p>
          </div>
        ) : error ? (
          <div className="feedback-error">
            <h3>Error</h3>
            <p>{error}</p>
            <div className="error-actions">
              <button className="refresh-button" onClick={handleRefreshFeedback}>
                Refresh
              </button>
              <button className="primary-button" onClick={handleBackToDashboard}>
                Return to Dashboard
              </button>
            </div>
          </div>
        ) : feedback ? (
          <div className="feedback-content">
            <div className="feedback-summary">
              <div className="feedback-score">
                <h2>Overall Score</h2>
                <div className="score-display">
                  <div className="score-number">{feedback.score.toFixed(1)}</div>
                  <div className="score-stars">{renderStars(feedback.score)}</div>
                </div>
                <div className="certification-badge" data-eligible={feedback.certification_eligible}>
                  {feedback.certification_eligible
                    ? `Certification Eligible: ${feedback.certification_level || 'Standard'}`
                    : 'Not Eligible for Certification'}
                </div>
              </div>
              <div className="feedback-details">
                <div className="detail-item">
                  <span className="detail-label">Doctor Specialty:</span>
                  <span className="detail-value">{feedback.specialty}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Doctor Nature:</span>
                  <span className="detail-value">{feedback.nature}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Doctor Gender:</span>
                  <span className="detail-value">{feedback.gender}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Product Name:</span>
                  <span className="detail-value">{feedback.product_name}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Session Status:</span>
                  <span className="detail-value status-badge" data-status={feedback.final_status}>{feedback.final_status}</span>
                </div>

              </div>
            </div>

            <div className="feedback-text">
              <h2>Detailed Feedback</h2>
              <div className="markdown-content">

                {/* Display the table separately */}
                {feedback.llm_feedback_text.includes('|') && (
                  <FeedbackTable markdownText={feedback.llm_feedback_text} />
                )}

                {/* Display any content after the table */}
                <ReactMarkdown>
                  {feedback.llm_feedback_text.includes('|') ?
                    feedback.llm_feedback_text.split(/\n\| Criterion \|[\s\S]*?(?=\n\n|$)/)[1] || '' :
                    ''}
                </ReactMarkdown>
              </div>
            </div>

            {feedback.per_message_violations_logged.length > 0 && (
              <div className="violations-section">
                <h2>Compliance Violations</h2>
                <ul className="violations-list">
                  {feedback.per_message_violations_logged.map((violation, index) => (
                    <li key={index} className="violation-item">
                      <div className="violation-rule">Rule: {violation.rule_id}</div>
                      <div className="violation-description">{violation.description}</div>
                      {violation.action && (
                        <div className="violation-action">
                          <strong>Recommended Action:</strong> {violation.action}
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="feedback-actions">
              {feedback.certification_eligible && (
                <button
                  className="certificate-button"
                  onClick={handleDownloadCertificate}
                  disabled={isDownloading}
                >
                  {isDownloading ? 'Downloading...' : 'Download Certificate'}
                </button>
              )}
              <button className="refresh-button" onClick={handleRefreshFeedback} disabled={isLoading}>
                {isLoading ? 'Refreshing...' : 'Refresh Feedback'}
              </button>
              <button className="primary-button" onClick={handleBackToDashboard}>
                Return to Dashboard
              </button>
              {downloadError && (
                <div className="download-error">
                  <div className="error-icon">⚠️</div>
                  <div className="error-message-text">{downloadError}</div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="feedback-error">
            <h3>No Feedback Available</h3>
            <p>No feedback data was found for this session.</p>
            <div className="error-actions">
              <button className="refresh-button" onClick={handleRefreshFeedback}>
                Refresh
              </button>
              <button className="primary-button" onClick={handleBackToDashboard}>
                Return to Dashboard
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedbackPage;

