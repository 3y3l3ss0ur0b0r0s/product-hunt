import { Component, Pipe } from '@angular/core';
import { NgFor, NgIf, DatePipe } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCircleArrowUp, faCircleArrowDown } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NgFor, NgIf, DatePipe, FontAwesomeModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent {
  products: Map<string, any>[] = []

  upArrow = faCircleArrowUp;
  downArrow = faCircleArrowDown;

  sortMethod = 'newest';

  numUsersOnline = 2;

  getRandomMs() {
    return Math.random() * 1000 * 20;
  }

  getRandomDate(from: Date, to: Date) {
    let fromTime = from.getTime();
    let toTime = to.getTime();
    return new Date(fromTime + Math.random() * (toTime - fromTime));
  }

  ngOnInit() {
    this.products = [new Map([['title', 'Loading . . .']])];

    // Get products from API
    fetch('https://fakestoreapi.com/products')
      .then(response => response.json())
      .then(json => {
        this.products = [];
        console.log(json);
        json.forEach((product: any) => {
          let newProduct = new Map([
            ['image', product['image']],
            ['title', product['title']],
            ['description', product['description']],
            ['upvotes', Math.floor(Math.random() * 300)],
            ['downvotes', Math.floor(Math.random() * 300)],
            ['posted', this.getRandomDate(new Date('2025-01-01T00:00:00.0Z'), new Date())]
          ]);
          this.products.push(newProduct);
        });

        // Sort by default sort method
        this.sort(this.sortMethod);
      });
  }

  handleSortMethodChange(event: Event) {
    this.sortMethod = (event.target as HTMLSelectElement).value;
    this.sort(this.sortMethod);
  }

  sort(method: string) {
    console.log(`Sorting by: ${method}`);
    if (method === 'newest') {
      this.products.sort((a, b) => {
        if (a.get('posted') > b.get('posted')) {
          return -1;
        } 
        else if (a.get('posted') < b.get('posted')) {
          return 1;
        }
        return 0;
      });
    } 
    else if (method === 'highestUpvoteDownvoteRatio') {
      this.products.sort((a, b) => {
        if (a.get('upvotes') / a.get('downvotes') > b.get('upvotes') / b.get('downvotes')) {
          return -1;
        } 
        else if (a.get('upvotes') / a.get('downvotes') < b.get('upvotes') / b.get('downvotes')) {
          return 1;
        }
        return 0;
      });
    }
    else if (method === 'mostUpvotes') {
      this.products.sort((a, b) => {
        if (a.get('upvotes') > b.get('upvotes')) {
          return -1;
        } 
        else if (a.get('upvotes') < b.get('upvotes')) {
          return 1;
        }
        return 0;
      });
    }
    else if (method === 'leastDownvotes') {
      this.products.sort((a, b) => {
        if (a.get('downvotes') < b.get('downvotes')) {
          return -1;
        } 
        else if (a.get('downvotes') > b.get('downvotes')) {
          return 1;
        }
        return 0;
      });
    }
    else if (method === 'highestNetUpvotes') {
      this.products.sort((a, b) => {
        if (a.get('upvotes') - a.get('downvotes') > b.get('upvotes') - b.get('downvotes')) {
          return -1;
        } 
        else if (a.get('upvotes') - a.get('downvotes') < b.get('upvotes') - b.get('downvotes')) {
          return 1;
        }
        return 0;
      });
    }
    else {
      throw new Error(`Invalid sort method: ${method}`);
    }
  }

  vote(productTitle: string, voteType: string) {
    let index = this.products.findIndex(product => product.get('title') == productTitle);
    if (index == -1) {
      throw new Error(`Product titled ${productTitle} not found | Cannot ${voteType}`);
    }
    let key = voteType + 's';
    this.products[index].set(key, this.products[index].get(key) + 1);
    // Re-sort
    this.sort(this.sortMethod);
  }
}
