import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, Users, Package, Settings, ChevronDown,
  FileText, Printer, Gift, ShoppingBag, Truck,
  CreditCard, BarChart4, Wrench, LogOut
} from 'lucide-react';



const SidebarItem = ({ icon: Icon, label, to, hasSubItems, isActive, onClick }) => {
  return (
    <Link
      to={to || '#'}
      onClick={onClick}
      className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-lg ${
        isActive 
          ? 'bg-purple-100 text-purple-900' 
          : 'text-gray-700 hover:bg-gray-100'
      }`}
    >
      <Icon className="w-5 h-5 mr-3" />
      <span className="flex-1">{label}</span>
      {hasSubItems && <ChevronDown className="w-4 h-4" />}
    </Link>
  );
};

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [expandedItems, setExpandedItems] = React.useState({
    orders: false,
    products: false,
    marketing: false,
    settings: false
  });

  const toggleExpand = (key) => {
    setExpandedItems(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleLogout = () => {
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('adminEmail');
    navigate('/');
  };

  return (
    <div className="w-64 bg-white border-r min-h-screen p-4 flex flex-col">
      <div className="flex items-center mb-8">
        <img src="/logo.png" alt="PrintHub" className="h-8" />
        <span className="ml-2 text-xl font-semibold">PrintHub</span>
      </div>

      <nav className="space-y-1 flex-1">
        <SidebarItem 
          icon={Home} 
          label="Dashboard" 
          to="/admin"
          isActive={location.pathname === '/admin'}
        />

        <SidebarItem 
          icon={Users} 
          label="Users" 
          to="/admin/users"
          isActive={location.pathname.includes('/admin/users')}
        />

        {/* Orders Section */}
        <div>
          <SidebarItem 
            icon={Package} 
            label="Orders" 
            hasSubItems 
            onClick={() => toggleExpand('orders')}
            isActive={location.pathname.includes('/admin/orders')}
          />
          {expandedItems.orders && (
            <div className="ml-6 mt-1 space-y-1">
              <Link 
                to="/admin/orders/new"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                New Orders
              </Link>
              <Link 
                to="/admin/orders/processing"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                Processing
              </Link>
              <Link 
                to="/admin/orders/completed"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                Completed
              </Link>
            </div>
          )}
        </div>

        {/* Products Section */}
        <div>
          <SidebarItem 
            icon={ShoppingBag} 
            label="Products" 
            hasSubItems
            onClick={() => toggleExpand('products')}
          />
          {expandedItems.products && (
            <div className="ml-6 mt-1 space-y-1">
              <Link 
                to="/admin/products/categories"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                Categories
              </Link>
              <Link 
                to="/admin/products/list"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                Product List
              </Link>
              <Link 
                to="/admin/products/inventory"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                Inventory
              </Link>
            </div>
          )}
        </div>

        {/* Service Management - New separate menu item */}
        <SidebarItem 
          icon={Wrench} 
          label="Service Management" 
          to="/admin/services"
          isActive={location.pathname.includes('/admin/services')}
        />

        {/* Marketing Section */}
        <div>
          <SidebarItem 
            icon={Gift} 
            label="Marketing" 
            hasSubItems
            onClick={() => toggleExpand('marketing')}
          />
          {expandedItems.marketing && (
            <div className="ml-6 mt-1 space-y-1">
              <Link 
                to="/admin/marketing/promotions"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                Promotions
              </Link>
              <Link 
                to="/admin/marketing/coupons"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                Coupons
              </Link>
            </div>
          )}
        </div>

        <SidebarItem 
          icon={Truck} 
          label="Delivery" 
          to="/admin/delivery"
        />

        <SidebarItem 
          icon={CreditCard} 
          label="Payments" 
          to="/admin/payments"
        />

        <SidebarItem 
          icon={BarChart4} 
          label="Reports" 
          to="/admin/reports"
        />

        <SidebarItem 
          icon={Settings} 
          label="Settings" 
          to="/admin/settings"
        />
      </nav>

      {/* Logout Button at Bottom */}
      <div className="border-t pt-4 mt-4">
        <SidebarItem 
          icon={LogOut} 
          label="Logout" 
          onClick={handleLogout}
        />
      </div>
    </div>
  );
};

export default Sidebar;