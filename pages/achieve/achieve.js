// pages/achieve/achieve.js
Page({
  data: {
    achieveList:[
      {
        text:'初出茅庐',
        image:'/static/imgs/ji/1.png',
        condition:'记账7天'
      },
      {
        text:'有条有理',
        image:'/static/imgs/ji/2.png',
        condition:'记账7天且支出/收入>15%'
      },
      {
        text:'稍有成就',
        image:'/static/imgs/ji/3.png',
        condition:'记账7天且支出/收入>30%'
      },
      {
        text:'中华小当家',
        image:'/static/imgs/ji/4.png',
        condition:'记账21天且支出/收入>15%'
      },
      {
        text:'家里没矿',
        image:'/static/imgs/ji/5.png',
        condition:'记账21天且支出/收入>30%'
      },
      {
        text:'理财达人',
        image:'/static/imgs/ji/6.png',
        condition:'记账45天且支出/收入>15%'
      },
      {
        text:'聚宝大亨',
        image:'/static/imgs/ji/7.png',
        condition:'记账45天且支出/收入>30%'
      },
      {
        text:'勒紧腰带',
        image:'/static/imgs/ji/8.png',
        condition:'收入=支出'
      },
      {
        text:'入不敷出',
        image:'/static/imgs/ji/9.png',
        condition:'100%<支出/收入<130%'
      },
      {
        text:'家里有矿',
        image:'/static/imgs/ji/10.png',
        condition:'支出/收入>130%'
      },
    ]
  }
})