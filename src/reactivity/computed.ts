/*
 * @Author: qwh 15806293089@163.com
 * @Date: 2022-11-01 15:49:17
 * @LastEditors: qwh 15806293089@163.com
 * @LastEditTime: 2022-11-01 15:49:21
 * @FilePath: /mini-vue-study/src/reactivity/computed.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { ReactiveEffect } from "./effect";

class ComputedRefImpl {
  private _dirty: boolean = true;
  private _value: any;
  private _effect: any;
  constructor(getter: any) {
    this._effect = new ReactiveEffect(getter, () => {
      if (!this._dirty) {
        this._dirty = true;
      }
    });
  }

  get value() {
    if (this._dirty) {
      this._dirty = false;
      this._value = this._effect.run();
    }

    return this._value;
  }
}

export function computed(getter:any) {
  return new ComputedRefImpl(getter);
}