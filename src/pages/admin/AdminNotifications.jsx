import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { HiPaperAirplane } from 'react-icons/hi';

const AdminNotifications = () => {
  return (
    <div>
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold text-dark-800">Notifications</h1>
        <p className="text-dark-500 mt-1">Send push and email notifications to students</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <h3 className="font-heading font-bold text-dark-800 mb-6">Send Notification</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-dark-700 mb-1">Target</label>
              <select className="w-full px-4 py-2.5 rounded-xl border border-dark-200 focus:ring-2 focus:ring-primary-500">
                <option>All Students</option>
                <option>Specific Course Students</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-700 mb-1">Title</label>
              <input type="text" className="w-full px-4 py-2.5 rounded-xl border border-dark-200 focus:ring-2 focus:ring-primary-500" placeholder="Notification title" />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-700 mb-1">Message</label>
              <textarea rows={4} className="w-full px-4 py-2.5 rounded-xl border border-dark-200 focus:ring-2 focus:ring-primary-500 resize-none" placeholder="Notification message..." />
            </div>
            <div className="flex gap-3">
              <Button variant="primary" icon={HiPaperAirplane}>Send Push Notification</Button>
            </div>
          </div>
        </Card>

        <Card>
          <h3 className="font-heading font-bold text-dark-800 mb-6">Recent Notifications</h3>
          <div className="text-center py-12 text-dark-400">
            <p>No notifications sent yet.</p>
            <p className="text-xs mt-2">Push notifications require Firebase Cloud Messaging setup.</p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminNotifications;
