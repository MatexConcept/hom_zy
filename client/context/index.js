import Reac, { useEffect, useContext, createContext } from "react";

import {
  useAddress,
  useContract,
  useMetamask,
  useContractWrite,
  useContractRead,
  useContractEvents,
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

  const realEstate = "Real Estate Dapp";

  //FUNCTION

  //1. listProperty()

  const { mutateAsync: listProperty, isLoading } = useContractWrite(
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

 const { mutateAsync: updateProperty, isLoading: updatePropertyLoading } = useContractWrite(
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

  const { mutateAsync: updatePrice, isLoading: updatePriceLoading } = useContractWrite(
    contract,
    "updatePrice"
  );

  const updatePriceFunction = async(form) => {
    const {productId, price} =form;

    try {
        const data = await updatePrice([address, productId, price]);

        console.log("Transaction successfully", data)
    } catch (error) {
        console.log("fail transaction", error)
    }
  }

  //4. buyProperty()
  const { mutateAsync: buyProperty, isLoading: buyPropertyLoading } = useContractWrite(
    contract,
    "buyProperty"
  );

  const buyPropertyFunction = async(from) =>{
        const {id} = from;
        try {
            const data = await buyProperty({args:[id, address]});
            console.log("buying successfully", data)
        } catch (error) {
            console.log("Buying fail", error)
        }
  }

  // REVIEWS FUNCTION
    //5. addReview()

    const { mutateAsync: addReview, isLoading: addReviewLoading } = useContractWrite(
        contract,
        "addReview"
      );

    const addReviewFunction = async(from) => {
        const {productId, rating, comment} = from
        try {

            const data = await addReview({args:[productId, rating,comment,address  ]})

            console.log("successfully added review", data)
        } catch (error) {
            console.log("adding review fail", error)
        }
    }

    //6. likeReview()
    const { mutateAsync: likeReview, isLoading: likeReviewLoading } = useContractWrite(
        contract,
        "likeReview"
      );

      const likeReviewFunction = async (from) => {
        const {productId, reviewIndex} = from;

        try {
            const data = await likeReview({args:[productId, reviewIndex,address ]})
           console.log("Successfully like the comment", data) 
        } catch (error) {
           console.log("Liking fail", error) 
        }
      }

  // GET PROPERTIES DATA SECTION
  //7.getAllPropertiesData
  const getPropertiesData = async() => {
    try {
        const properties = await contract.call("getAllProperties");

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

  const {data: getHighestratedProduct, isLoading:getHighestratedProductLoading} = useContractRead(contract, "getHighestratedProduct");

  //9. getProductReviews ()
  const getProductReviewsFunction = (productId) => {
    try {
        const {data:getProductReviews, isLoading: getProductReviewsLoading} = useContractRead(contract, "getProductReviews");

        return getProductReviews, getProductReviewsLoading;
    } catch (error) {
        console.log("fail to get property reviews", error)
    }
  }

  //10. getProperty()

  const getPropertyFunction = (id) => {
    try {
        
        const {data: getProperty, isLoading: getPropertyLoading} = useContractRead("getProperty", [id]);
        return getProperty, getPropertyLoading;

    } catch (error) {
        console.log("error while getting single property", error)
    }
  }

  //11. getUserProperties()

  const getUserPropertiesFunction = () => {
    try {
        const {data: getUserProperties, isLoading: getUserPropertiesLoading} = useContractRead("getUserProperties", [address]);

        return getUserProperties, getUserPropertiesLoading;
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
      value={{ address, connect, contract, realEstate, createPropertyFunction, getPropertiesData, updatePropertyFunction, updatePriceFunction, buyPropertyFunction, addReviewFunction, likeReviewFunction, getHighestratedProduct, getProductReviewsFunction, getPropertyFunction,getUserPropertiesFunction, getUserReviewsFunction , totalPropertyFunction, totalReviewsFunction  }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
