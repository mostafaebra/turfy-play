import { useLocation } from 'react-router-dom';

const BookingPage = () => {
  const location = useLocation();
  const data = location.state; // دي الشنطة اللي استلمناها

  return (
    <div className="p-10 text-center">
      <h1 className="text-3xl font-bold text-green-600 mb-4">Booking Page (Test)</h1>
      <p className="text-gray-600 mb-8">This is a placeholder to test data transfer.</p>

      {/* عرضنا الداتا اللي وصلت عشان نتأكد إنها سليمة */}
      <div className="bg-gray-100 p-6 rounded-xl text-left max-w-lg mx-auto overflow-auto">
        <pre className="text-sm font-mono text-gray-800">
          {data ? JSON.stringify(data, null, 2) : "No Data Received ❌"}
        </pre>
      </div>
    </div>
  );
};

export default BookingPage;