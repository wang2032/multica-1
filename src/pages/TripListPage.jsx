import TripCard from '../components/TripCard';
import { mockTrips } from '../data/mockTrips';
import './TripListPage.css';

function TripListPage() {
  const trips = mockTrips;

  return (
    <div className="trip-list-page">
      <h1 className="page-title">我的旅行计划</h1>

      {trips.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">✈️</div>
          <p className="empty-text">暂无旅行计划</p>
          <p className="empty-hint">开始规划您的第一次旅行吧！</p>
        </div>
      ) : (
        <div className="trip-list">
          {trips.map((trip) => (
            <TripCard key={trip.id} trip={trip} />
          ))}
        </div>
      )}
    </div>
  );
}

export default TripListPage;