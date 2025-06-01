// Tabs.tsx
interface TabsProps {
  activeTab: "available" | "saved";
  onChange: (tab: "available" | "saved") => void;
}

const Tabs: React.FC<TabsProps> = ({ activeTab, onChange }) => (
  <div className="flex border-b border-gray-200 mb-6">
    <button
      onClick={() => onChange("available")}
      className={`px-6 py-3 font-medium ${activeTab === "available" ? "text-red-600 border-b-2 border-red-600" : "text-gray-500"}`}
    >
      Voucher Có Sẵn
    </button>
    <button
      onClick={() => onChange("saved")}
      className={`px-6 py-3 font-medium ${activeTab === "saved" ? "text-red-600 border-b-2 border-red-600" : "text-gray-500"}`}
    >
      Voucher Đã Lưu
    </button>
  </div>
);

export default Tabs;
