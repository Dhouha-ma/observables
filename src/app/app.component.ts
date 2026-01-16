import { Component, DestroyRef, effect, OnInit, signal } from '@angular/core';

import { interval, map, Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  clickCount = signal(0);
  customObservable$ = new Observable((subscriber) => {
    let timesExecuted = 0;

    const interval = setInterval(() => {
      if (timesExecuted > 3) {
        clearInterval(interval);
        subscriber.complete();

        return;
      }

      console.log('emitting new value');
      subscriber.next({ message: 'new value' });

      timesExecuted++;
    }, 2000);
  });

  constructor(private destroyRef: DestroyRef) {
    effect(() => {
      console.log(`clicked button ${this.clickCount()} times.`);
    });
  }

  ngOnInit(): void {
    const subscription = interval(1000)
      .pipe(map((val) => val * 2))
      .subscribe({
        next: (val) => console.log(val),
      });

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });

    this.customObservable$.subscribe({
      next: (value) => console.log(value),
      complete: () => console.log('completed'),
      error: (error) => console.log(error),
    });
  }

  onClick() {
    this.clickCount.update((prevCount) => prevCount + 1);
  }
}
