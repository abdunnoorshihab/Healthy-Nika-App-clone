import {environment} from '../../../environments/environment';

export const DATABASE_KEY = Object.freeze({
  loginToken: 'HEALTHY_NIKA_TOKEN_' + environment.VERSION,
  loggInSession: 'HEALTHY_NIKA_SESSION_' + environment.VERSION,
  loginTokenAdmin: 'HEALTHY_NIKA_ADMIN_TOKEN_' + environment.VERSION,
  loggInSessionAdmin: 'HEALTHY_NIKA_ADMIN_SESSION_' + environment.VERSION,
  encryptAdminLogin: 'HEALTHY_NIKA_USER_0_' + environment.VERSION,
  encryptDeliverymanLogin: 'HEALTHY_NIKA_USER_1_' + environment.VERSION,
  loginAdminRole: 'HEALTHY_NIKA_ADMIN_ROLE_' + environment.VERSION,
  cartsProduct: 'HEALTHY_NIKA_USER_CART_' + environment.VERSION,
  productFormData: 'HEALTHY_NIKA_PRODUCT_FORM_' + environment.VERSION,
  userCart: 'HEALTHY_NIKA_USER_CART_' + environment.VERSION,
  userWishList: 'SOFTLAB_USER_WISHLIST_' + environment.VERSION,
  recommendedProduct: 'HEALTHY_NIKA_RECOMMENDED_PRODUCT_' + environment.VERSION,
  userCoupon: 'HEALTHY_NIKA_USER_COUPON_' + environment.VERSION,
  userCookieTerm: 'HEALTHY_NIKA_COOKIE_TERM' + environment.VERSION,
  otpCheck: 'HEALTHY_NIKA_COOKIE_TERM_' + environment.VERSION,
  signUpHoldData: 'HEALTHY_NIKA_SIGNUP_HOLD_DATA' + environment.VERSION,
  encryptUserLogin: 'HEALTHY_NIKA_USER_1_' + environment.VERSION,


});
