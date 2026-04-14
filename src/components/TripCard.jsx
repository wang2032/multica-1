import './TripCard.css';

function TripCard({ trip }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      month: 'long',
      day: 'numeric',
    });
  };

  const formatDateRange = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const startYear = startDate.getFullYear();
    const endYear = endDate.getFullYear();

    const startMonthDay = formatDate(start);
    const endMonthDay = formatDate(end);

    if (startYear === endYear) {
      return `${startMonthDay} - ${endMonthDay}, ${startYear}`;
    }
    return `${startMonthDay}, ${startYear} - ${endMonthDay}, ${endYear}`;
  };

  return (
    <div className="trip-card">
      <h3 className="trip-name">{trip.name}</h3>
      <div className="trip-destination">
        <span className="location-icon">📍</span>
        {trip.destination}
      </div>
      <div className="trip-dates">
        <span className="calendar-icon">📅</span>
        {formatDateRange(trip.startDate, trip.endDate)}
      </div>
    </div>
  );
}

export default TripCard;