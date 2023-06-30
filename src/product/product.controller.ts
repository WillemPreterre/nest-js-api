import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductInterface } from './product.interface';

@Controller('')
export class ProductController {
  constructor(private readonly productService: ProductService) { }

  // Création d'un produit
  @Post()
  create(@Body() productInterface: ProductInterface) {
    return this.productService.create(productInterface);
  }
  // Récupération de tous les produits
  @Get()
  findAll() {
    return this.productService.findAll();
  }
  
  // Récupération d'un produit
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): ProductInterface {
    return this.productService.findOne(id);
  }
  // Modification d'un produit
  @Patch(':id')
  update(@Param('id') id: string, @Body() ProductInterface) {
    return this.productService.update(+id, ProductInterface);
  }
  // Suppression d'un produit
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.remove(+id);
  }
}
