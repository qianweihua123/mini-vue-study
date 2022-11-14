/*
 * @Author: qwh 15806293089@163.com
 * @Date: 2022-11-13 20:02:24
 * @LastEditors: qwh 15806293089@163.com
 * @LastEditTime: 2022-11-14 16:29:49
 * @FilePath: /mini-vue-study/example/update/main.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { h, ref } from "../../lib/mini-vue-study.esm.js";

export const App = {
  name: "App",

  setup() {
    const count = ref(0);

    const onClick = () => {
      console.log('执行事件',count);

      count.value++;
    };

    const props = ref({
      foo: "foo",
      bar: "bar",
    });
    const onChangePropsDemo1 = () => {
      props.value.foo = "new-foo";
    };

    const onChangePropsDemo2 = () => {
      props.value.foo = undefined;
    };

    const onChangePropsDemo3 = () => {
      props.value = {
        foo: "foo",
      };
    };

    return {
      count,
      onClick,
      onChangePropsDemo1,
      onChangePropsDemo2,
      onChangePropsDemo3,
      props,
    };
  },
  render() {
    return h(
      "div",
      {
        id: "root",
        ...this.props
      },
      [
        h("div", {}, "count:" + this.count), // 依赖收集
        h(
          "button",
          {
            onClick: this.onClick,
          },
          "click"
        ),
        h(
          "button",
          {
            onClick: this.onChangePropsDemo1,
          },
          "changeProps - 值改变了 - 修改"
        ),

        h(
          "button",
          {
            onClick: this.onChangePropsDemo2,
          },
          "changeProps - 值变成了 undefined - 删除"
        ),

        h(
          "button",
          {
            onClick: this.onChangePropsDemo3,
          },
          "changeProps - key 在新的里面没有了 - 删除"
        ),
      ]
    );
  },
};