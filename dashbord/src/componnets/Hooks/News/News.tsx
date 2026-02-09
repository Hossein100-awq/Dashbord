"use client";
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AxiosPromise } from "axios";
import { merchantApiClient } from "@/Interceptor/axios"; 

import { ProductItem } from "./../../../componnets/Cart/CartOut";
import ProductListUI from "./../../../componnets/Cart/CartOut";

interface PagedResponse {
  total: number;
  data: ProductItem[];
}

interface ProductApiResponse {
  isSuccess: boolean;
  isFailed: boolean;
  value: PagedResponse; 
}

interface ProductQueryParams {
  _page: number;
  _limit: number;
  Name?: string;
  IsActive?: boolean;
  Brand?: string;
}

const fetchMerchants = (params: ProductQueryParams): AxiosPromise<ProductApiResponse> => {
  return merchantApiClient.get('/admin/Merchant/Search', { params });
};

const CartOut = () => {
  const [open, setOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const { data: listData, isLoading: isListLoading, isError: isListError } = useQuery({
    queryKey: ['productList', page, pageSize],
    queryFn: () => fetchMerchants({ _page: page, _limit: pageSize }),
  });

  const productList = listData?.data?.value?.data || [];
  const total = listData?.data?.value?.total || 0;
  const totalPages = Math.ceil(total / pageSize);

  const handleOpen = (item: ProductItem) => {
    setSelectedProduct(item);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedProduct(null);
  };

  return (
    <ProductListUI
      productList={productList}
      totalPages={totalPages}
      page={page}
      isLoading={isListLoading}
      isError={isListError}
      open={open}
      selectedProduct={selectedProduct}
      onPageChange={handlePageChange}
      onOpen={handleOpen}
      onClose={handleClose}
    />
  );
};

export default CartOut;