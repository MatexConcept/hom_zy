import Reac, {useState, useEffect, useContext, createContext } from "react";

import {
  useAddress,
  useContract,
  useMetamask,
  useContractWrite,
  useContractRead,
  useContractEvents,
  useDisconnect,
  useConnectionStatus,
  useSigner
} from "@thirdweb-dev/react";

import { ethers } from "ethers";
import { recoverAddress } from "ethers/lib/utils";

const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
  const { contract } = useContract(
    "0xb6703d0422a1cc8d02FCa4cc82522E646A43f2fd"
  );

  const address = useAddress();
  const connect = useMetamask();


  //FRONTEND

  const disconnect = useDisconnect();
  const connectionStatus = useConnectionStatus();
  const signer = useSigner();

  //STATE VARIABLE

  const [userBalance, setUserBalance] = useState();
  const [isLoading, setIsLoading] = useState(false);
  

  //FUNCTION

  //1. listProperty()

  const { mutateAsync: listProperty } = useContractWrite(
    contract,
    "listProperty"
  );

  const createPropertyFunction = async (form) => {
    const {
      propertyTitle,
      description,
      category,
      price,
      images,
      propertyAddress,
    } = form;

    try {
      const data = await listProperty({
        args: [
          address,
          price,
          propertyTitle,
          category,
          images,
          propertyAddress,
          description,
        ],
      });
      console.info("contract call successs", data);
    } catch (err) {
      console.error("contract call failure", err);
    }
  };
 //2. updateProperty()

 const { mutateAsync: updateProperty,  } = useContractWrite(
    contract,
    "updateProperty"
  );

  const updatePropertyFunction = async(from) => {
    const {
        productId,
        propertyTitle, 
        description,
        category,
        images,
        propertyAddress,
     } = from;

     try {
        const data = await updateProperty({
            args:[
                address,
                productId,
                propertyTitle,
                category,
                images,
                propertyAddress,
                description,
            ],
        });

        connect.log("contract call successfully update", data)
      } catch (error) {
        console.log("Error while updating")
      }
  };

  //3. updatePrice

  const { mutateAsync: updatePrice } = useContractWrite(
    contract,
    "updatePrice"
  );

  const updatePriceFunction = async(form) => {
    const {productID, price} =form;

    try {
        const data = await updatePrice ({
          args:[address, productID, ethers.utils.parseEther(price)],
        })

        console.log("Transaction successfully", data)
    } catch (error) {
        console.log("fail transaction", error)
    }
  }

  //4. buyProperty()
  const { mutateAsync: buyProperty } = useContractWrite(
    contract,
    "buyProperty"
  );

  const buyPropertyFunction = async(buying) =>{
        const {productID, amount} = buying;
        try {
            const data = await buyProperty({
            args:[productID, address], 
            value:ethers.utils.parseEther(amount), });
            console.log("buying successfully", data);
        } catch (error) {
            console.log("Buying fail", error)
        }
  }

  // REVIEWS FUNCTION
    //5. addReview()

    const { mutateAsync: addReview } = useContractWrite(
        contract,
        "addReview"
      );

    const addReviewFunction = async(from) => {
        const {productID, rating, comment} = from
        try {

            const data = await addReview({args:[productID, rating,comment,address  ]})

            console.log("successfully added review", data)
        } catch (error) {
            console.log("adding review fail", error)
        }
    }

    //6. likeReview()
    const { mutateAsync: likeReview } = useContractWrite(
        contract,
        "likeReview"
      );

      const likeReviewFunction = async (from) => {
        const {productID, reviewIndex} = from;

        try {
            const data = await likeReview({args:[productID, reviewIndex,address ]})
           console.log("Successfully like the comment", data) 
        } catch (error) {
           console.log("Liking fail", error) 
        }
      }

  // GET PROPERTIES DATA SECTION
  //7.getAllPropertiesData
  const getPropertiesData = async() => {
    try {
      // get all market properties
        const properties = await contract.call("getAllProperties");

        // get user balance

        const balance = await signer?.getBalance();

        const userBalance = address ? ethers.utils.formatEther(balance?.toString()) : "";

        setUserBalance(userBalance);
        const parsedProperties = properties.map((property, i) => ({
            owner: property.owner,
            title:property.propertyTitle,
            description:property.description,
            category:property.category,
            price:ethers.utils.formatEther(property.price.toString()),
            productId:property.productID.toNumber(),
            reviewers:property.reviewers,
            reviews:property.reviews,
            image:property.images,
            address:property.propertyAddress
        }));

        return parsedProperties;
    } catch (error) {
        console.log("Error while loading data", error)
    }
  }


  //8. getHighestratedProduct

  const {data: getHighestratedProduct} = useContractRead(contract, "getHighestratedProduct");

  //9. getProductReviews ()
  const getProductReviewsFunction = async (productId) => {
    try {
       const getProductReviews = await contract.call("getProductReview", [productId, ]);

      const parsedReviews = getProductReviews?.map((review, i) => ({
        reviewer: review.reviewer,
        likes:review.likes.toNumber(),
        comment: review.comment,
        rating: review.rating,
        productID: review.productId.toNumber(),
      }));

      return parsedReviews;
    } catch (error) {
        console.log("fail to get property reviews", error)
    }
  }

  //10. getProperty()

  const getPropertyFunction = async (id) => {
    const productID = id * 1;
    try {
        
        const propertyItem = await contract.call("getProperty", [productID]);

        const property = {
          productID: propertyItem?.[0].toNumber(),
          owner: propertyItem?.[1],
          title: propertyItem?.[3],
          category:propertyItem?.[4],
          description: propertyItem?.[7],
          price: ethers.utils.formatEther(propertyItem?.[2].toString()),
          images:propertyItem?.[5],

        };
        return property;
    } catch (error) {
        console.log("error while getting single property", error)
    }
  }

  //11. getUserProperties()

  const getUserPropertiesFunction = async () => {
    try {
        const properties = await contract.call("getUserProperties", [address]);

        const parsedProperties = properties.map((property, i) => ({
          owner: property.owner,
          title:property.title,
          description:property.description,
          category: property.category,
          price: ethers.utils.formatEther(property.price.toString()),
          productID: property.productID.toNumber(),
          reviewers:property.reviewers,
          reviews: property.reviews,
          image: property.images,
          address: property.propertyAddress,
        }))

        return parsedProperties; 
    } catch (error) {
        console.log("error while getting user property", error)
    }
  }

  //12. getUserReviews()

  const getUserReviewsFunction = () => {
    try {
        
        const {data: getUserReviews, isLoading: getUserReviewsLoading} = useContractRead("getUserReviews", [address]);

        return getUserReviews, getUserReviewsLoading;

    } catch (error) {
        console.log("error", error)
    }
  }

  //13. totalPropertyFunction

  const totalPropertyFunction = () => {
    try {
        const {data: totalProperty, isLoading: totalPropertyLoading} = useContractRead(contract, "propertyIndex");

        return totalProperty, totalPropertyLoading;
    } catch (error) {
        console.log(error)
    }
  }

  //14. totalReview

  const totalReviewsFunction = () => {
    try {
        const {data: totalReviewsCount, isLoading: totalReviewsCountLoading} = useContractWrite(contract, "reviewsCounter");

        return totalReviewsCount,totalReviewsCountLoading;
    } catch (error) {
        console.log(error);
    }
  }

  //How To Read Data With Events
  // Get Specific Events

  const {data: event} = useContractEvents(contract, "PropertyListed");

  // GET ALL EVENTS

  const {data: allEvents} = useContractEvents(contract);

  // SET DEFAULT

  const {data: eventWithoutListner } = useContractEvents(contract,undefined, {
     subscribe: false,
  } 
  );

//   console.log(event)
    // console.log(allEvents)
    // console.log(eventWithoutListner)

  return (
    <StateContext.Provider
      value={{ address, connect, contract,  createPropertyFunction, getPropertiesData, updatePropertyFunction, updatePriceFunction, buyPropertyFunction, addReviewFunction, likeReviewFunction, getHighestratedProduct, getProductReviewsFunction, getPropertyFunction,getUserPropertiesFunction, getUserReviewsFunction , totalPropertyFunction, totalReviewsFunction  }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
