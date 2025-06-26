import React from 'react';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import { Mail, Phone, MessageCircle, FileText, ExternalLink, Clock } from 'lucide-react';

export default function Support() {
  const supportTickets = [
    {
      id: 'T001',
      subject: 'Tournament creation issue',
      status: 'Open',
      priority: 'High',
      created: '2025-06-19',
      lastUpdate: '2025-06-19 14:30',
    },
    {
      id: 'T002',
      subject: 'User registration problem',
      status: 'In Progress',
      priority: 'Medium',
      created: '2025-06-18',
      lastUpdate: '2025-06-19 10:15',
    },
    {
      id: 'T003',
      subject: 'Report generation error',
      status: 'Resolved',
      priority: 'Low',
      created: '2025-06-17',
      lastUpdate: '2025-06-18 16:45',
    },
  ];

  const handleCreateTicket = () => {
    alert('Create support ticket functionality would be implemented here');
  };

  const handleContactSupport = (method: string) => {
    alert(`Contact support via ${method} functionality would be implemented here`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-text">Support</h1>
        <p className="text-gray-600">Get help and manage support tickets</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contact Support */}
        <div className="lg:col-span-1">
          <Card title="Contact Support">
            <div className="space-y-4">
              <button
                onClick={() => handleContactSupport('email')}
                className="w-full flex items-center p-3 border border-border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Mail className="h-5 w-5 text-primary mr-3" />
                <div className="text-left">
                  <div className="font-medium">Email Support</div>
                  <div className="text-sm text-gray-500">support@tournapp.com</div>
                </div>
              </button>

              <button
                onClick={() => handleContactSupport('phone')}
                className="w-full flex items-center p-3 border border-border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Phone className="h-5 w-5 text-primary mr-3" />
                <div className="text-left">
                  <div className="font-medium">Phone Support</div>
                  <div className="text-sm text-gray-500">+1 (555) 123-4567</div>
                </div>
              </button>

              <button
                onClick={() => handleContactSupport('chat')}
                className="w-full flex items-center p-3 border border-border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <MessageCircle className="h-5 w-5 text-primary mr-3" />
                <div className="text-left">
                  <div className="font-medium">Live Chat</div>
                  <div className="text-sm text-gray-500">Available 24/7</div>
                </div>
              </button>
            </div>

            <div className="mt-6 pt-6 border-t border-border">
              <h4 className="font-medium mb-3">Support Hours</h4>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>Mon-Fri: 9:00 AM - 6:00 PM</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>Sat-Sun: 10:00 AM - 4:00 PM</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Quick Links */}
          <Card className="mt-6" title="Quick Links">
            <div className="space-y-3">
              <a
                href="#"
                className="flex items-center text-sm text-primary hover:text-blue-600 transition-colors"
              >
                <FileText className="h-4 w-4 mr-2" />
                <span>User Manual</span>
                <ExternalLink className="h-3 w-3 ml-auto" />
              </a>
              <a
                href="#"
                className="flex items-center text-sm text-primary hover:text-blue-600 transition-colors"
              >
                <FileText className="h-4 w-4 mr-2" />
                <span>API Documentation</span>
                <ExternalLink className="h-3 w-3 ml-auto" />
              </a>
              <a
                href="#"
                className="flex items-center text-sm text-primary hover:text-blue-600 transition-colors"
              >
                <FileText className="h-4 w-4 mr-2" />
                <span>Video Tutorials</span>
                <ExternalLink className="h-3 w-3 ml-auto" />
              </a>
              <a
                href="#"
                className="flex items-center text-sm text-primary hover:text-blue-600 transition-colors"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                <span>Community Forum</span>
                <ExternalLink className="h-3 w-3 ml-auto" />
              </a>
            </div>
          </Card>
        </div>

        {/* Support Tickets */}
        <div className="lg:col-span-2">
          <Card title="Support Tickets">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold">Recent Tickets</h3>
              <Button onClick={handleCreateTicket}>
                Create New Ticket
              </Button>
            </div>

            <div className="space-y-4">
              {supportTickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="border border-border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="font-medium text-primary">#{ticket.id}</span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            ticket.status === 'Open'
                              ? 'bg-red-100 text-red-800'
                              : ticket.status === 'In Progress'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-green-100 text-green-800'
                          }`}
                        >
                          {ticket.status}
                        </span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            ticket.priority === 'High'
                              ? 'bg-red-100 text-red-800'
                              : ticket.priority === 'Medium'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {ticket.priority}
                        </span>
                      </div>
                      <h4 className="font-medium text-gray-900 mb-1">{ticket.subject}</h4>
                      <div className="text-sm text-gray-500">
                        <span>Created: {ticket.created}</span>
                        <span className="mx-2">•</span>
                        <span>Last update: {ticket.lastUpdate}</span>
                      </div>
                    </div>
                    <Button variant="secondary" size="sm">
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-border">
              <Button variant="secondary" className="w-full">
                View All Tickets
              </Button>
            </div>
          </Card>

          {/* Create Ticket Form */}
          <Card className="mt-6" title="Create Support Ticket">
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Priority
                  </label>
                  <select className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary">
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary">
                    <option value="technical">Technical Issue</option>
                    <option value="account">Account Problem</option>
                    <option value="feature">Feature Request</option>
                    <option value="billing">Billing Question</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subject *
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="Brief description of the issue"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  required
                  rows={4}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="Detailed description of the issue, including steps to reproduce if applicable"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Attachments
                </label>
                <input
                  type="file"
                  multiple
                  className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                />
                <p className="text-xs text-gray-500 mt-1">
                  You can attach screenshots, logs, or other relevant files
                </p>
              </div>

              <div className="flex justify-end">
                <Button type="submit">
                  Submit Ticket
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}