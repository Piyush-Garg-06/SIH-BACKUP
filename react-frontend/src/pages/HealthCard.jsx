import { useAuth } from '../contexts/useAuth';
import HealthCardComponent from '../components/HealthCard';

const HealthCard = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <HealthCardComponent user={user} />
    </div>
  );
};

export default HealthCard;
