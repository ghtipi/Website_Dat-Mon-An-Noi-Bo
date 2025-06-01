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
import type { VoucherData } from "../components/VoucherGrid"; // import type-only
import EmptyState from "../components/EmptyState";

const Voucher: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"available" | "saved">("available");
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");

  const [vouchers, setVouchers] = useState<VoucherData[]>([
    {
      id: 1,
      imageUrl: "/voucher1.png",
      title: "Giảm 20%",
      description: "Giảm 20% cho đơn hàng từ 200k",
      value: "20%",
      expiryDate: "2025-06-30",
      minOrder: 200000,
      category: "Thời trang",
      isSaved: false,
    },
    {
      id: 2,
      imageUrl: "/voucher2.png",
      title: "Freeship",
      description: "Miễn phí vận chuyển đơn từ 50k",
      value: "Freeship",
      expiryDate: "2025-07-15",
      minOrder: 50000,
      category: "Giao hàng",
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
        {/* Sidebar ẩn trên mobile, rộng 256px trên md+ */}
        <div className="hidden md:block w-64">
          <Sidebar />
        </div>

        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            <Header />
            <Tabs activeTab={activeTab} onChange={setActiveTab} />

            {/* Thanh tìm kiếm và filter */}
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

            {/* Tag category */}
            <div className="mb-6">
              <SelectedCategoryTag
                category={selectedCategory}
                onClear={() => setSelectedCategory("Tất cả")}
              />
            </div>

            {/* Voucher Grid hoặc Empty State */}
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
