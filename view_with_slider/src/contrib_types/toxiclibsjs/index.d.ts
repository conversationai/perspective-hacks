/*
Copyright 2017 Google Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
// TODO(ldixon): move these typings to definitely typed, or to github/npm.

declare module 'toxiclibsjs' {
  type RGBAColor = [number, number, number, number];

  export class TColor {
    toRGBADecimalArray() : RGBAColor;
  }
  // Color utils package.
  export namespace color {
    export class ColorList {
      public colors : TColor[];
    }

    export class ColorGradient {
      addColorAt(from:number, to:number) : void;
      calcGradient(from:number, to:number) : ColorList;
    }
    export namespace TColor {
      function newHex(hexSTring:string) : number;
    }
  }
}
