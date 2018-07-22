import Vue from 'vue'
import Router from 'vue-router'
import login from '@/components/login'
import stktran from '@/components/stktran'
import pmttran from '@/components/pmttran'
import item from '@/components/item'
import party from '@/components/party'
import inventory from '@/components/inventory'
import repstock from '@/components/repstock'
import repprtbal from '@/components/repprtbal'
import repdattran from '@/components/repdattran'
import replocn from '@/components/replocn'
import account from '@/components/account'
import editstran from '@/components/editstran'
import editptran from '@/components/editptran'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/login',
      name: 'login',
      component: login
    },
    {
      path: '/stktran',
      name: 'stktran',
      props: true,
      component: stktran
    },
    {
      path: '/pmttran',
      name: 'pmttran',
      props: true,
      component: pmttran
    },
    {
      path: '/item/:itemID?',
      name: 'item',
      component: item,
      props: true
    },
    {
      path: '/party/:partyID?',
      name: 'party',
      component: party,
      props: true
    },
    {
      path: '/editstran',
      name: 'editstran',
      component: editstran
    },
    {
      path: '/editptran',
      name: 'editptran',
      component: editptran
    },
    {
      path: '/inventory',
      name: 'inventory',
      component: inventory
    },
    {
      path: '/repstock',
      name: 'repstock',
      props: true,
      component: repstock
    },
    {
      path: '/repprtbal',
      name: 'repprtbal',
      props: true,
      component: repprtbal
    },
    {
      path: '/repdattran',
      name: 'repdattran',
      props: true,
      component: repdattran
    },
    {
      path: '/account/:id?',
      name: 'account',
      props: true,
      component: account
    },
    {
      path: '/replocn',
      name: 'replocn',
      props: true,
      component: replocn
    }
  ]
})
