// pages/Voucher.tsx

import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Background from "../components/BackGround";
import Header from "../components/Header";
import Tabs from "../components/Tabs";
import SearchBarVoucher from "../components/SearchBarVoucher";
import FilterDropdown from "../components/FilterDropdown";
import SelectedCategoryTag from "../components/SelectedCategoryTag";
import VoucherGrid from "../components/VoucherGrid";
import type { VoucherData } from "../components/VoucherGrid";
import EmptyState from "../components/EmptyState";

const Voucher: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"available" | "saved">("available");
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");

  const [vouchers, setVouchers] = useState<VoucherData[]>([
    {
      id: 1,
      imageUrl: "/food-voucher1.png",
      title: "Giảm 30K",
      description: "Giảm 30K cho đơn đồ ăn từ 150K",
      value: "30K",
      expiryDate: "2025-06-30",
      minOrder: 150000,
      category: "Ẩm thực",
      isSaved: false,
    },
    {
      id: 2,
      imageUrl: "/food-voucher2.png",
      title: "Mua 1 tặng 1",
      description: "Mua 1 ly trà sữa tặng 1 ly cùng loại",
      value: "Buy 1 Get 1",
      expiryDate: "2025-07-15",
      minOrder: 0,
      category: "Trà sữa",
      isSaved: false,
    },
    {
      id: 3,
      imageUrl: "/food-voucher3.png",
      title: "Giảm 50K",
      description: "Giảm 50K cho đơn đồ ăn từ 300K",
      value: "50K",
      expiryDate: "2025-07-20",
      minOrder: 300000,
      category: "Ẩm thực",
      isSaved: false,
    },
    {
      id: 4,
      imageUrl: "/coffee-voucher.png",
      title: "Freeship cà phê",
      description: "Miễn phí vận chuyển đơn cà phê từ 100k",
      value: "Freeship",
      expiryDate: "2025-07-10",
      minOrder: 100000,
      category: "Cà phê",
      isSaved: false,
    },
    {
      id: 5,
      imageUrl: "/fastfood-voucher.png",
      title: "Combo tiết kiệm",
      description: "Giảm 25% cho các combo đồ ăn nhanh",
      value: "25%",
      expiryDate: "2025-07-25",
      minOrder: 0,
      category: "Đồ ăn nhanh",
      isSaved: false,
    },
    {
      id: 6,
      imageUrl: "/drink-voucher.png",
      title: "Nước uống miễn phí",
      description: "Tặng 1 ly nước ép khi mua bất kỳ món chính",
      value: "Free drink",
      expiryDate: "2025-08-05",
      minOrder: 120000,
      category: "Nước uống",
      isSaved: false,
    },
  ]);

  const handleSave = (id: number) => {
    setVouchers((prev) =>
      prev.map((v) => (v.id === id ? { ...v, isSaved: !v.isSaved } : v))
    );
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const clearSearch = () => setSearchTerm("");

  const categories = [
    "Tất cả",
    ...Array.from(new Set(vouchers.map((v) => v.category).filter(Boolean))),
  ] as string[];

  const filteredVouchers = vouchers.filter((voucher) => {
    if (activeTab === "available" && voucher.isSaved) return false;
    if (activeTab === "saved" && !voucher.isSaved) return false;

    const matchSearch =
      voucher.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      voucher.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchCategory =
      selectedCategory === "Tất cả" || voucher.category === selectedCategory;

    return matchSearch && matchCategory;
  });

  return (
    <Background>
      <div className="flex min-h-screen">
        <div className="hidden md:block w-64">
          <Sidebar />
        </div>

        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            <Header />
            <Tabs activeTab={activeTab} onChange={setActiveTab} />

            <div className="mb-4 flex flex-wrap gap-2 items-center">
              <div className="flex-1 min-w-[250px]">
                <SearchBarVoucher
                  value={searchTerm}
                  onChange={handleSearch}
                  onClear={clearSearch}
                  widthClassName="w-full max-w-3xl"
                />
              </div>
              <div className="min-w-[150px]">
                <FilterDropdown
                  showFilters={showFilters}
                  onToggle={() => setShowFilters(!showFilters)}
                  categories={categories}
                  selectedCategory={selectedCategory}
                  onSelectCategory={(cat) => {
                    setSelectedCategory(cat);
                    setShowFilters(false);
                  }}
                />
              </div>
            </div>

            <div className="mb-6">
              <SelectedCategoryTag
                category={selectedCategory}
                onClear={() => setSelectedCategory("Tất cả")}
              />
            </div>

            {filteredVouchers.length > 0 ? (
              <VoucherGrid
                vouchers={filteredVouchers}
                onSave={handleSave}
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
              />
            ) : (
              <EmptyState
                searchTerm={searchTerm}
                onClearFilters={() => {
                  setSearchTerm("");
                  setSelectedCategory("Tất cả");
                }}
              />
            )}
          </div>
        </main>
      </div>
    </Background>
  );
};

export default Voucher;