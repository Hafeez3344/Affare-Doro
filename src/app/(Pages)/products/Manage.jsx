import React, { useEffect, useState } from "react";
import Image from "next/image";
import BACKEND_URL, { getProducts } from "@/api/api";
import { notification, Modal, Carousel, Pagination } from "antd";
import { Heart, ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { updatePageNavigation } from "@/features/features";

const Manage = ({ searchQuery }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [seller, setSeller] = useState(null);
  const [wishlist, setWishlist] = useState({});
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
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
    if (!auth) {
      router.push("/login");
      return;
    }
    dispatch(updatePageNavigation("products"));
    fetchCategories();
  }, [auth, router, dispatch]);

  // const toggleWishlist = (id) => {
  //   setWishlist((prev) => ({ ...prev, [id]: !prev[id] }));
  // };

  const handleModalOpen = (category) => {
    setSelectedCategory(category);
    setSeller(category.userId); // Set seller data from userId
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setSelectedCategory(null);
    setSeller(null);
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

  // Filter categories based on search query and paginate
  const filteredCategories = categories
    .filter((category) =>
      category.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .reverse(); // Reverse to show latest first

  const paginatedCategories = filteredCategories.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset to first page when search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  console.log("Categories:", categories);

  // Add function to handle seller profile click
  const handleSellerClick = (sellerId) => {
    router.push(`/customers/${sellerId}`);
  };

  return (
    <>
      <div className="flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <p className="text-sm text-gray-500">
            Showing{" "}
            {Math.min(currentPage * itemsPerPage, filteredCategories.length)} of{" "}
            {filteredCategories.length} products
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-x-4 gap-y-6 justify-items-center">
          {paginatedCategories.map((category) => (
            <div
              key={category._id}
              className="bg-white shadow-md rounded-xl overflow-hidden py-2 relative w-full max-w-[250px] h-[370px]"
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

              <div className="mt-3 px-3">
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

                <div className="mt-3 mb-3">
                  <p className="text-[12px] text-gray-500">
                    Category:{" "}
                    {category.categoryId?.[category.categoryId.length - 1]
                      ?.name || "Others"}
                  </p>

                  <p className="text-[12px] font-semibold text-teal-600 mt-3">
                    <Image
                      alt=""
                      src="/dirham-sign.svg"
                      width={16}
                      height={16}
                      className="inline-block mr-1 "
                    />{" "}
                    {category.inclPrice || "Others"}{" "}
                  </p>
                </div>

                {/* Seller Information */}
                <div
                  className=" pt-3 border-t cursor-pointer group"
                  onClick={() => handleSellerClick(category.userId?._id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {/* seller image perfect showing  */}
                      <Image
                        src={
                          category.userId?.image
                            ? category.userId?.image?.includes("uploads")
                              ? `${BACKEND_URL}/${category.userId.image}`
                              : category.userId.image
                            : "/imageLogo2.jpg"
                        }
                        alt={category.userId?.username || "Seller"}
                        width={45}
                        height={70}
                        className="rounded-full object-cover h-[30px] w-[30px]"
                      />
                      <div>
                        <p className="text-gray-900 text-[14px] font-semibold">
                          {category.userId?.username || "Seller Name"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredCategories.length > itemsPerPage && (
          <div className="flex justify-end mt-6">
            <Pagination
              current={currentPage}
              onChange={(page) => setCurrentPage(page)}
              total={filteredCategories.length}
              pageSize={itemsPerPage}
              showSizeChanger={false}
            />
          </div>
        )}
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
          <div className="flex flex-col gap-6 ">
            <div className="flex gap-6">
              {/* Left side - Product Details */}
              <div className="flex-1 flex flex-col gap-4 mt-2">
                {/* First Section - Basic Product Details */}
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <p className="text-[15px] font-[600] w-[120px]">
                      Product Name:
                    </p>
                    <p className="text-[14px]">{selectedCategory.name || "Others"}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="text-[15px] font-[600] w-[120px]">Category:</p>
                    <p className="text-[14px]">
                      {selectedCategory.categoryId?.[
                        selectedCategory?.categoryId?.length - 1
                      ]?.name || "Others"}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="text-[15px] font-[600] w-[120px]">Material:</p>
                    <p className="text-[14px]">
                      {selectedCategory.materialId?.[
                        selectedCategory?.materialId?.length - 1
                      ]?.name || "Others"}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="text-[15px] font-[600] w-[120px]">Size:</p>
                    <p className="text-[14px]">
                      {selectedCategory.sizeId?.name || "Others"}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="text-[15px] font-[600] w-[120px]">Color:</p>
                    <p className="text-[14px]">
                      {selectedCategory.colorId?.[0]?.name || "Others"}
                    </p>
                  </div>
                </div>

                {/* Second Section - Price Details */}
                <div className="flex flex-col gap-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-3">
                    <p className="text-[15px] font-[600] w-[120px]">
                      Product Price:
                    </p>
                    <div className="flex items-center gap-1">
                      <span className="text-[27px] font-[500] text-black">
                        <Image
                          alt=""
                          src="/dirham-sign.svg"
                          width={18}
                          height={18}
                          className="inline-block mb-2"
                        />
                      </span>
                      <p className="text-[14px] text-teal-600 font-semibold">
                        {selectedCategory.price || "Others"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 -mt-4">
                    <p className="text-[15px] font-[600] w-[120px]">
                      Shipping Cost:
                    </p>
                    <div className="flex items-center gap-1">
                      <span className="text-[27px] font-[500] text-black">
                        <Image
                          alt=""
                          src="/dirham-sign.svg"
                          width={18}
                          height={18}
                          className="inline-block mb-2"
                        />
                      </span>
                      <p className="text-[14px] text-teal-600 font-semibold">
                        {selectedCategory.shipPrice || "Others"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 -mt-4">
                    <p className="text-[15px] font-[600] w-[120px]">
                      Protection Fee:
                    </p>
                    <div className="flex items-center gap-1">
                      <span className="text-[27px] font-[500] text-black">
                        <Image
                          alt=""
                          src="/dirham-sign.svg"
                          width={18}
                          height={18}
                          className="inline-block mb-2"
                        />
                      </span>
                      <p className="text-[14px] text-teal-600 font-semibold">
                        {selectedCategory.inclPrice || "Others"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 -mt-4">
                    <p className="text-[15px] font-[600] w-[120px]">
                      Total Price:
                    </p>
                    <div className="flex items-center gap-1">
                      <span className="text-[27px] font-[500] text-black">
                        <Image
                          alt=""
                          src="/dirham-sign.svg"
                          width={18}
                          height={18}
                          className="inline-block mb-2"
                        />
                      </span>
                      <p className="text-[14px] text-teal-600 font-semibold">
                        {selectedCategory.totalPrice || "Others"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Seller Information */}
                <div
                  className="mt-auto pt-4 border-t cursor-pointer group"
                  onClick={() => handleSellerClick(seller?._id)}
                >
                  <div className="bg-[#F5F5F5] p-3 rounded-lg transition-all duration-200 hover:bg-[#EBEBEB] hover:shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Image
                          src={
                            seller?.image
                              ? seller?.image?.includes("uploads")
                                ? `${BACKEND_URL}/${seller.image}`
                                : seller.image
                              : "/imageLogo2.jpg"
                          }
                          alt={seller?.username || "Seller"}
                          width={45}
                          height={70}
                          className="rounded-full object-cover h-[40px] w-[40px]"
                        />
                        <div>
                          <p className="text-gray-900 text-[14px] font-semibold">
                            {seller?.username || "Seller Name"}
                          </p>
                          <div className="flex items-center text-yellow-500">
                            {"★".repeat(Math.floor(seller?.rating || 0))}
                            {"☆".repeat(5 - Math.floor(seller?.rating || 0))}
                            <span className="text-gray-900 text-sm ml-2">
                              ({seller?.reviews || 0} reviews)
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
                  <div className="relative mb-4">
                    <Carousel
                      ref={carouselRef}
                      dots={false}
                      afterChange={(current) => setSelectedImageIndex(current)}
                    >
                      {selectedCategory.image.map((img, index) => (
                        <div key={index} className="w-full h-[433px]">
                          <Image
                            src={`${BACKEND_URL}/${img}`}
                            alt={`${selectedCategory.name} - ${index + 1}`}
                            className="w-full h-full object-contain rounded-lg shadow-md"
                            width={400}
                            height={400}
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
                  <div className="relative ">
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
                                selectedImageIndex === index
                                  ? "border-blue-500"
                                  : "border-transparent"
                              }`}
                              onClick={() => {
                                setSelectedImageIndex(index);
                                carouselRef.current.goTo(index);
                              }}
                            >
                              <Image
                                src={`${BACKEND_URL}/${img}`}
                                alt={`${selectedCategory.name} - Thumbnail ${
                                  index + 1
                                }`}
                                className="w-full h-full object-cover"
                                width={400}
                                height={400}
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
