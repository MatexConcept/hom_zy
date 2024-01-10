import React, {useEffect, useState} from "react";
import { useRouter } from "next/router";

//INTERNAL IMPORT
import {Header, Footer, Copyright, Loader} from '../PageComponents/Components';
import {
  DetailEight,
  DetailFive,
  DetailFour,
  DetailOne,
  DetailSeven,
  DetailSix,
  DetailThree,
  DetailTwo
} from "../PageComponents/DetailPage";

import { useStateContext } from "../context"


const detail = () => {
  //STATE VARIABLES
  const [property, setProperty] = useState();
  const [parsedReviews, setParsedReviews] = useState();
  const [properties, setProperties] = useState([]);
  const [isLoading,  setIsLoading] = useState(true);
  const [updatePriceLoading, setUpdatePriceLoading] = useState(false);
  const [commentLoading, setCommentLoading] = useState(false);
  const [buyLoading, setBuyLoading] = useState(false);
  
  const {
    address,
    contract,
    buyPropertyFunction,
    addReviewFunction,
    likeReviewFunction,
    getProductReviewsFunction,
    getPropertyFunction,
    getPropertiesData,
    updatePriceFunction,
  } = useStateContext();

  //get url query
  const router = useRouter()
  const {query} = router;

  // get property data
  const fetchProperty = async()=>{
  const data = await getPropertyFunction(query.property);
  const dataReviews = await getProductReviewsFunction(query.property);
  const dataProperties = await getPropertiesData();
  setProperties(dataProperties);
  setProperty(data);
  setParsedReviews(dataReviews);
  setIsLoading(false);
  };

  useEffect(() => {
    if (contract) fetchProperty()
  }, [address, contract])

  // add review
  
  const [review, setReview] = useState({
    productID: "",
    rating: 4,
    comment: "",
  });

  const handleFormFieldChange = (fieldName, e) => {
    setReview({...review, [fieldName]: e.target.value});
  };

  const createReview = async () => {
    setCommentLoading(true);
    const data = await addReviewFunction({
      ...review,
      productID: property.productID,
    });
    setCommentLoading(false);
  };

  // like review
  const [likeReviews, setLikeReviews] = useState({
    productID: "",
    reviewIndex: "",
  });

  const likeReviewCall = async () => {
    const data = await likeReviewFunction({
      ...likeReviews,
      productID: property.productID,
    });
    window.location.reload();
  };

  // Buy Property

  const buying = {
    productID: property?.productID,
    amount: property?.price,
  };

  const buyingProperty = async() => {
    setBuyLoading(true);
    const data = await buyPropertyFunction(buying);
    setBuyLoading(false);
  }

  // update price
  const [updatePropertyPrice, setUpdatePropertyPrice] = useState({
    productID: property?.productID,
    price: "",
  });

  const updatepropertyPrice = async () => {
    setUpdatePriceLoading(true);
    await updatePriceFunction({
      ...updatePropertyPrice,
      productID: property?.productID,
    });
    setUpdatePriceLoading(false);
    window.location.reload();
  }

  return <div className="template-color-1 nft-body-connect">
  <Header/>
  <DetailOne/>

  <DetailTwo
      property = {property}
    parsedReviews = {parsedReviews}
    setLikeReviews = {setLikeReviews}
    likeReviews = {likeReviews}
    likeReviewCall = {likeReviewCall}
    buyingProperty = {buyingProperty}
    address = {address}
    isLoading = {isLoading}
    buyLoading = {buyLoading}
  />
  <DetailThree/>
  <DetailFour/>
  <DetailFive/>
  <DetailSix/>
  <DetailSeven/>
  <DetailEight/>
  <Footer/>
  <Copyright/>
  </div>;
};

export default detail;
