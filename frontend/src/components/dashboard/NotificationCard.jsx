export default function NotificationCard({ title, message }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
      <h4 className="text-sm font-semibold text-gray-900">{title}</h4>
      <p className="mt-2 text-sm leading-6 text-gray-500">{message}</p>
    </div>
  );
}