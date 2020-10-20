import { User } from './User';
import { Product } from './Product';

export class Order{
  user: String;
  products: Product[];
  status: String;
  date: Date;
  isDelivered: Boolean;
  manufacturer: String;
  garden: String;

  //products: [{name: String},{manufacturer: String},{type: String},{reviews: [{comment:String},{rating: Number}]},{quantity: Number},{available: Boolean}]
}
