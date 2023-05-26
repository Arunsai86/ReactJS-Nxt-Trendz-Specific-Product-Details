import {Component} from 'react'
import {Link, withRouter} from 'react-router-dom'
import {BsDashSquare, BsPlusSquare} from 'react-icons/bs'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import Header from '../Header'

import SimilarProductItem from '../SimilarProductItem'
import './index.css'

const apiStatusLoading = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class ProductItemDetails extends Component {
  state = {
    productDetails: [],
    apiStatus: apiStatusLoading.initial,
    showErrMsg: '',
    itemCount: 1,
    similarProductsData: [],
  }

  componentDidMount() {
    this.getProduct()
  }

  onSuccessProducts = responseObj => {
    const updatedData = {
      imageUrl: responseObj.image_url,
      availability: responseObj.availability,
      brand: responseObj.brand,
      description: responseObj.description,
      id: responseObj.id,
      price: responseObj.price,
      rating: responseObj.rating,
      similarProducts: responseObj.similar_products,
      totalReviews: responseObj.total_reviews,
      title: responseObj.title,
      style: responseObj.style,
    }

    const updateSimilarProductsData = updatedData.similarProducts.map(each => ({
      imageUrl: each.image_url,
      availability: each.availability,
      brand: each.brand,
      description: each.description,
      id: each.id,
      price: each.price,
      rating: each.rating,
      totalReviews: each.total_reviews,
      title: each.title,
      style: each.style,
    }))

    this.setState({
      productDetails: updatedData,
      similarProductsData: updateSimilarProductsData,
      apiStatus: apiStatusLoading.success,
    })
  }

  onFailureProduct = msg => {
    this.setState({
      showErrMsg: msg,
      apiStatus: apiStatusLoading.failure,
    })
  }

  getProduct = async () => {
    this.setState({
      apiStatus: apiStatusLoading.inProgress,
    })
    const {match} = this.props
    const {params} = match
    const {id} = params
    // console.log(id)
    const url = `https://apis.ccbp.in/products/${id}`
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(url, options)
    const data = await response.json()

    if (response.ok === true) {
      this.onSuccessProducts(data)
    } else {
      this.onFailureProduct(data.error_msg)
    }
  }

  onIncrementItemCount = () => {
    this.setState(prevState => ({
      itemCount: prevState.itemCount + 1,
    }))
  }

  onDecrementItemCount = () => {
    const {itemCount} = this.state
    if (itemCount > 1) {
      this.setState(prevState => ({
        itemCount: prevState.itemCount - 1,
      }))
    }
  }

  renderLoaderView = () => (
    <div className="primedeals-loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderProductFailureView = () => {
    const {showErrMsg} = this.state
    return (
      <div className="product-error-container">
        <img
          src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
          alt="failure view"
          className="product-err-image"
        />
        <h1>{showErrMsg}</h1>
        <Link to="/products">
          <button type="button" className="logout-desktop-btn">
            Continue Shopping
          </button>
        </Link>
      </div>
    )
  }

  renderProductSuccessView = () => {
    const {productDetails, itemCount, similarProductsData} = this.state
    const {
      imageUrl,
      title,
      brand,
      price,
      rating,
      totalReviews,
      description,
      availability,
    } = productDetails
    // console.log(similarProductsData)
    return (
      <div className="each-product-page-container">
        <div className="product-item-top-section">
          <img src={imageUrl} alt="product" className="product-item-banner" />
          <div>
            <h1 className="title">{title}</h1>
            <p className="price">Rs {price}/- </p>
            <div className="product-details">
              <div className="rating-container">
                <p className="rating">{rating}</p>
                <img
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                  alt="star"
                  className="star"
                />
              </div>
              <p>{totalReviews} Reviews </p>
            </div>
            <p>{description}</p>
            <p className="brand">Availability: {availability}</p>
            <p className="brand">Brand: {brand}</p>
            <hr />
            <div className="cart-selection-container">
              <button
                type="button"
                className="minus-plus-btn"
                onClick={this.onDecrementItemCount}
                data-testid="minus"
              >
                <BsDashSquare />
              </button>
              <p>{itemCount}</p>
              <button
                type="button"
                className="minus-plus-btn"
                onClick={this.onIncrementItemCount}
                data-testid="plus"
              >
                <BsPlusSquare />
              </button>
            </div>
            <button type="button" className="logout-desktop-btn">
              Add To Cart
            </button>
          </div>
        </div>
        <h1 className="title">Similar Products</h1>
        <ul className="product-bottom-section-container">
          {similarProductsData.map(eachSimilarProduct => (
            <SimilarProductItem
              eachSimilarProduct={eachSimilarProduct}
              key={eachSimilarProduct.id}
            />
          ))}
        </ul>
      </div>
    )
  }

  renderDetails = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusLoading.success:
        return this.renderProductSuccessView()
      case apiStatusLoading.failure:
        return this.renderProductFailureView()
      case apiStatusLoading.inProgress:
        return this.renderLoaderView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        {this.renderDetails()}
      </>
    )
  }
}
export default withRouter(ProductItemDetails)
