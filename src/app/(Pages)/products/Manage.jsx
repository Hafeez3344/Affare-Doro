import React, { useEffect, useState } from "react";
import Image from "next/image";
import BACKEND_URL, { getProducts } from "@/api/api";
import { notification, Modal, Carousel } from "antd";
import { Heart, ChevronLeft, ChevronRight } from "lucide-react";
import { IoSearch } from "react-icons/io5";
import { useRouter } from "next/navigation";

// Function to generate star ratings
const getStarRating = (rating) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 !== 0;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  return (
    <span className="text-yellow-500 text-lg">
      {"★".repeat(fullStars)}
      {halfStar && "☆"}
      {"☆".repeat(emptyStars)}
    </span>
  );
};

const Manage = () => {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [wishlist, setWishlist] = useState({});
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const carouselRef = React.useRef();
  const thumbnailCarouselRef = React.useRef();

  const fetchCategories = async () => {
    try {
      const response = await getProducts();
      if (response?.status && Array.isArray(response?.data)) {
        setCategories(response.data);
      } else {
        throw new Error(response?.message || "Failed to fetch categories");
      }
    } catch (error) {
      notification.error({
        message: "Error",
        description: error.message || "An unexpected error occurred",
        placement: "topRight",
        style: { marginTop: "50px" },
      });
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // const toggleWishlist = (id) => {
  //   setWishlist((prev) => ({ ...prev, [id]: !prev[id] }));
  // };

  const handleModalOpen = (category) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setSelectedCategory(null);
    setIsModalOpen(false);
  };

  const nextSlide = () => {
    if (carouselRef.current) {
      carouselRef.current.next();
    }
  };

  const prevSlide = () => {
    if (carouselRef.current) {
      carouselRef.current.prev();
    }
  };

  const nextThumbnailSlide = () => {
    if (thumbnailCarouselRef.current) {
      thumbnailCarouselRef.current.next();
    }
  };

  const prevThumbnailSlide = () => {
    if (thumbnailCarouselRef.current) {
      thumbnailCarouselRef.current.prev();
    }
  };

  // Filter categories based on search query
  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  console.log("Categories:", categories);

  return (
    <>
      <div className="mb-6">
        <div className="w-full">
          <div className="bg-white h-[50px] rounded-[8px] flex items-center px-[25px] gap-3 shadow-sm">
            <IoSearch className="text-[var(--text-color-body)] text-[20px]" />
            <input 
              className="flex-1 focus:outline-none text-[15px]" 
              placeholder="Search Here"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-x-4 gap-y-6 justify-items-center">
        {filteredCategories.map((category) => (
          <div
            key={category._id}
            className="bg-white shadow-md rounded-xl overflow-hidden py-2 relative w-full max-w-[250px] h-[360px]"
          >

            <div className="relative h-[200px] w-full group">
              <Image
                alt={category.name}
                src={`${BACKEND_URL}/${category.image?.[0]}`}
                className="w-full h-full object-cover rounded-lg"
                width={250}
                height={200}
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <button
                  onClick={() => handleModalOpen(category)}
                  className="bg-white text-gray-800 px-3 py-2 rounded-md font-medium hover:bg-gray-100 transition-colors"
                >
                  View Detail
                </button>
              </div>
            </div>

            <div className="mt-2 px-3">
              <div className="flex justify-between items-center">
                <button
                  onClick={() => handleModalOpen(category)}
                  className="text-sm font-semibold text-gray-800 hover:underline text-nowrap"
                >
                  {category.name}
                </button>

                {/* <button
                  className={`cursor-pointer transition-colors ${wishlist[category._id]
                      ? "text-red-500"
                      : "text-gray-500 hover:text-red-300"
                    }`}
                  onClick={() => toggleWishlist(category._id)}
                >
                  <Heart
                    size={18}
                    fill={wishlist[category._id] ? "red" : "none"}
                  />
                </button> */}
              </div>

              <div className="flex items-center gap-1 mt-1">
                {getStarRating(4.5)}
              </div>

              <div className="mt-1">
                <p className="text-[12px] text-gray-500">
                  Category: {category.categoryId?.[category.categoryId.length-1]?.name || "N/A"}
                </p>
                {/* <p className="text-[12px] text-gray-500">
                  Material: {category.materialId?.[0]?.name || "N/A"}
                </p>
                <p className="text-[12px] text-gray-500">
                  Size: {category?.sizeId?.name || "None"}
                </p>
                <p className="text-[12px] text-gray-500">
                  Color: {category?.colorId?.[0]?.name || "None"}
                </p> */}
                <p className="text-[12px] font-semibold text-teal-600">
                  $ {category.price || "N/A"}
                </p>
                <p className="text-[12px] font-semibold text-teal-600">
                  $ {category.inclPrice || "N/A"}{" "}
                  <span className="text-xs text-gray-400">incl.</span>
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Product View Model  */}
      <Modal
        centered
        footer={null}
        width={800}
        title={<p className="text-[20px] font-[700]">Product Details</p>}
        open={isModalOpen}
        onCancel={handleModalClose}
      >
        {selectedCategory && (
          <div className="flex flex-col gap-6">
            <div className="flex gap-6">
              {/* Left side - Product Details */}
              <div className="flex-1 flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <p className="text-[14px] font-[600] w-[120px]">Product Name:</p>
                  <p className="text-[14px]">{selectedCategory.name}</p>
                </div>
                <div className="flex items-center gap-3">
                  <p className="text-[14px] font-[600] w-[120px]">Status:</p>
                  <span className="px-2 py-1 rounded-[20px] text-[11px] flex items-center justify-center bg-[#10CB0026] text-[#0DA000]">
                    {selectedCategory.status || "Active"}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <p className="text-[14px] font-[600] w-[120px]">Category:</p>
                  <p className="text-[14px]">{selectedCategory.categoryId?.[selectedCategory?.categoryId?.length-1]?.name || "N/A"}</p>
                </div>
                <div className="flex items-center gap-3">
                  <p className="text-[14px] font-[600] w-[120px]">Material:</p>
                  <p className="text-[14px]">{selectedCategory.materialId?.[selectedCategory?.materialId?.length-1]?.name || "N/A"}</p>
                </div>
                <div className="flex items-center gap-3">
                  <p className="text-[14px] font-[600] w-[120px]">Size:</p>
                  <p className="text-[14px]">{selectedCategory.sizeId?.name || "None"}</p>
                </div>
                <div className="flex items-center gap-3">
                  <p className="text-[14px] font-[600] w-[120px]">Color:</p>
                  <p className="text-[14px]">{selectedCategory.colorId?.[0]?.name || "None"}</p>
                </div>
                <div className="flex items-center gap-3">
                  <p className="text-[14px] font-[600] w-[120px]">Price:</p>
                  <p className="text-[14px] text-teal-600 font-semibold">{selectedCategory.price || "N/A"}</p>
                </div>
                <div className="flex items-center gap-3">
                  <p className="text-[14px] font-[600] w-[120px]">Incl. Price:</p>
                  <p className="text-[14px] text-teal-600 font-semibold">
                    {selectedCategory.inclPrice || "N/A"}{" "}
                    <span className="text-xs text-gray-400">incl.</span>
                  </p>
                </div>

                {/* Seller Information */}
                <div 
                  className="mt-auto pt-4 border-t cursor-pointer group"
                  onClick={() => router.push('/customers/1')}
                >
                  <div className="bg-[#F5F5F5] p-3 rounded-lg transition-all duration-200 hover:bg-[#EBEBEB] hover:shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Image
                          src={selectedCategory.seller?.profileImage || "/default-profile.png"}
                          alt="Seller Profile"
                          width={40}
                          height={40}
                          className="rounded-full object-cover h-[40px]"
                        />
                        <div>
                          <p className="text-gray-900 text-[14px] font-semibold">
                            {selectedCategory.seller?.name || "Seller Name"}
                          </p>
                          <div className="flex items-center">
                            {getStarRating(4.5)}
                            <span className="text-gray-500 text-xs ml-1">
                              (120)
                            </span>
                          </div>
                        </div>
                      </div>
                      <ChevronRight 
                        size={20} 
                        className="text-gray-600 transition-transform group-hover:translate-x-1" 
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right side - Product Images */}
              {selectedCategory.image && selectedCategory.image.length > 0 && (
                <div className="w-[400px] flex-shrink-0">
                  <div className="relative">
                    <Carousel
                      ref={carouselRef}
                      dots={false}
                      afterChange={(current) => setSelectedImageIndex(current)}
                    >
                      {selectedCategory.image.map((img, index) => (
                        <div key={index} className="w-full h-[300px]">
                          <img
                            src={`${BACKEND_URL}/${img}`}
                            alt={`${selectedCategory.name} - ${index + 1}`}
                            className="w-full h-full object-cover rounded-lg shadow-md"
                          />
                        </div>
                      ))}
                    </Carousel>
                    
                    {/* Navigation Arrows */}
                    <button
                      onClick={prevSlide}
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md z-10 transition-all"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button
                      onClick={nextSlide}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md z-10 transition-all"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>

                  {/* Thumbnails Carousel */}
                  <div className="relative mt-4">
                    <div className="px-8">
                      <Carousel
                        ref={thumbnailCarouselRef}
                        dots={false}
                        slidesToShow={4}
                        slidesToScroll={1}
                        infinite={false}
                      >
                        {selectedCategory.image.map((img, index) => (
                          <div key={index} className="px-1">
                            <div
                              className={`cursor-pointer rounded-lg overflow-hidden border-2 h-[60px] ${
                                selectedImageIndex === index ? 'border-blue-500' : 'border-transparent'
                              }`}
                              onClick={() => {
                                setSelectedImageIndex(index);
                                carouselRef.current.goTo(index);
                              }}
                            >
                              <img
                                src={`${BACKEND_URL}/${img}`}
                                alt={`${selectedCategory.name} - Thumbnail ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </div>
                        ))}
                      </Carousel>
                    </div>

                    {/* Thumbnail Navigation Arrows */}
                    {selectedCategory.image.length > 4 && (
                      <>
                        <button
                          onClick={prevThumbnailSlide}
                          className="absolute left-0 top-1/2 -translate-y-1/2 bg-white hover:bg-gray-100 p-1.5 rounded-full shadow-md z-10 transition-all border border-gray-200"
                        >
                          <ChevronLeft size={16} />
                        </button>
                        <button
                          onClick={nextThumbnailSlide}
                          className="absolute right-0 top-1/2 -translate-y-1/2 bg-white hover:bg-gray-100 p-1.5 rounded-full shadow-md z-10 transition-all border border-gray-200"
                        >
                          <ChevronRight size={16} />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

export default Manage;