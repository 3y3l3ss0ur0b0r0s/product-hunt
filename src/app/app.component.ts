import { Component } from '@angular/core';
import { NgFor } from '@angular/common';
import { AngularFontAwesomeModule } from 'angular-font-awesome';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NgFor],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent {
  products: Map<string, any>[] = []

  ngOnInit() {
    fetch('https://fakestoreapi.com/products')
      .then(response => response.json())
      .then(json => {
        json.forEach((product: any) => {
          let newProduct = new Map([
            ['title', product['title']],
            ['upvotes', 0],
            ['downvotes', 0]
          ]);
          this.products.push(newProduct);
        });
      });
  }
}
