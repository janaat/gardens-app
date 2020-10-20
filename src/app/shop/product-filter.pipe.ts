import { PipeTransform, Pipe } from '@angular/core';
import { Product } from '../Product';
import { OrderServiceService } from '../order-service.service';
@Pipe({
  name: 'productFilter'
})
export class ProductFilterPipe implements PipeTransform{
  transform(products: Product[], searchText: string): Product[]{
    if(!products || !searchText){
      return products;
    }

    return products.filter(product=>product.name.toLowerCase().indexOf(searchText.toLowerCase())!==-1);
  }
}
