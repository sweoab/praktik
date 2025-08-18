import { sub } from 'date-fns';
import user1 from '@/assets/images/profile/user-1.jpg';
import user2 from '@/assets/images/profile/user-2.jpg';
import user3 from '@/assets/images/profile/user-3.jpg';
import user4 from '@/assets/images/profile/user-4.jpg';
import user5 from '@/assets/images/profile/user-5.jpg';
import user6 from '@/assets/images/profile/user-6.jpg';
import user7 from '@/assets/images/profile/user-7.jpg';
import user8 from '@/assets/images/profile/user-8.jpg';
import user9 from '@/assets/images/profile/user-9.jpg';
import user10 from '@/assets/images/profile/user-10.jpg';
import s1 from '@/assets/images/products/s1.jpg';
import s2 from '@/assets/images/products/s2.jpg';
import s3 from '@/assets/images/products/s3.jpg';
import s4 from '@/assets/images/products/s4.jpg';
import s5 from '@/assets/images/products/s5.jpg';
import s6 from '@/assets/images/products/s6.jpg';
import s7 from '@/assets/images/products/s7.jpg';
import s8 from '@/assets/images/products/s8.jpg';
import s9 from '@/assets/images/products/s9.jpg';
import s10 from '@/assets/images/products/s10.jpg';
import s11 from '@/assets/images/products/s11.jpg';
import s12 from '@/assets/images/products/s12.jpg';
import { Chance } from 'chance';
import { uniqueId } from 'lodash';
import { http, HttpResponse } from 'msw';

const chance = new Chance();

export let users = [
  {
    id: uniqueId('#follow_'),
    avatar: user1,
    name: chance.name(),
    role: chance.profession(),
    country: chance.country({ full: true }),
    isFollowed: chance.bool(),
  },
  {
    id: uniqueId('#follow_'),
    avatar: user2,
    name: chance.name(),
    role: chance.profession(),
    country: chance.country({ full: true }),
    isFollowed: chance.bool(),
  },
  {
    id: uniqueId('#follow_'),
    avatar: user3,
    name: chance.name(),
    role: chance.profession(),
    country: chance.country({ full: true }),
    isFollowed: chance.bool(),
  },
  {
    id: uniqueId('#follow_'),
    avatar: user4,
    name: chance.name(),
    role: chance.profession(),
    country: chance.country({ full: true }),
    isFollowed: chance.bool(),
  },
  {
    id: uniqueId('#follow_'),
    avatar: user5,
    name: chance.name(),
    role: chance.profession(),
    country: chance.country({ full: true }),
    isFollowed: chance.bool(),
  },
  {
    id: uniqueId('#follow_'),
    avatar: user6,
    name: chance.name(),
    role: chance.profession(),
    country: chance.country({ full: true }),
    isFollowed: chance.bool(),
  },
  {
    id: uniqueId('#follow_'),
    avatar: user7,
    name: chance.name(),
    role: chance.profession(),
    country: chance.country({ full: true }),
    isFollowed: chance.bool(),
  },
  {
    id: uniqueId('#follow_'),
    avatar: user8,
    name: chance.name(),
    role: chance.profession(),
    country: chance.country({ full: true }),
    isFollowed: chance.bool(),
  },
  {
    id: uniqueId('#follow_'),
    avatar: user9,
    name: chance.name(),
    role: chance.profession(),
    country: chance.country({ full: true }),
    isFollowed: chance.bool(),
  },
  {
    id: uniqueId('#follow_'),
    avatar: user10,
    name: chance.name(),
    role: chance.profession(),
    country: chance.country({ full: true }),
    isFollowed: chance.bool(),
  },
  {
    id: uniqueId('#follow_'),
    avatar: user1,
    name: chance.name(),
    role: chance.profession(),
    country: chance.country({ full: true }),
    isFollowed: chance.bool(),
  },
  {
    id: uniqueId('#follow_'),
    avatar: user2,
    name: chance.name(),
    role: chance.profession(),
    country: chance.country({ full: true }),
    isFollowed: chance.bool(),
  },
  {
    id: uniqueId('#follow_'),
    avatar: user3,
    name: chance.name(),
    role: chance.profession(),
    country: chance.country({ full: true }),
    isFollowed: chance.bool(),
  },
  {
    id: uniqueId('#follow_'),
    avatar: user4,
    name: chance.name(),
    role: chance.profession(),
    country: chance.country({ full: true }),
    isFollowed: chance.bool(),
  },
  {
    id: uniqueId('#follow_'),
    avatar: user5,
    name: chance.name(),
    role: chance.profession(),
    country: chance.country({ full: true }),
    isFollowed: chance.bool(),
  },
  {
    id: uniqueId('#follow_'),
    avatar: user6,
    name: chance.name(),
    role: chance.profession(),
    country: chance.country({ full: true }),
    isFollowed: chance.bool(),
  },
  {
    id: uniqueId('#follow_'),
    avatar: user7,
    name: chance.name(),
    role: chance.profession(),
    country: chance.country({ full: true }),
    isFollowed: chance.bool(),
  },
  {
    id: uniqueId('#follow_'),
    avatar: user8,
    name: chance.name(),
    role: chance.profession(),
    country: chance.country({ full: true }),
    isFollowed: chance.bool(),
  },
  {
    id: uniqueId('#follow_'),
    avatar: user9,
    name: chance.name(),
    role: chance.profession(),
    country: chance.country({ full: true }),
    isFollowed: chance.bool(),
  },
  {
    id: uniqueId('#follow_'),
    avatar: user10,
    name: chance.name(),
    role: chance.profession(),
    country: chance.country({ full: true }),
    isFollowed: chance.bool(),
  },
];

export let gallery = [
  {
    id: uniqueId('#gallery_'),
    cover: s1,
    name: chance.sentence({ words: 3 }),
    time: sub(new Date(), { days: 8, hours: 6, minutes: 20 }),
  },
  {
    id: uniqueId('#gallery_'),
    cover: s2,
    name: chance.sentence({ words: 3 }),
    time: sub(new Date(), { days: 8, hours: 4, minutes: 20 }),
  },
  {
    id: uniqueId('#gallery_'),
    cover: s3,
    name: chance.sentence({ words: 3 }),
    time: sub(new Date(), { days: 8, hours: 3, minutes: 20 }),
  },
  {
    id: uniqueId('#gallery_'),
    cover: s4,
    name: chance.sentence({ words: 3 }),
    time: sub(new Date(), { days: 8, hours: 2, minutes: 20 }),
  },
  {
    id: uniqueId('#gallery_'),
    cover: s5,
    name: chance.sentence({ words: 3 }),
    time: sub(new Date(), { days: 8, hours: 1, minutes: 20 }),
  },
  {
    id: uniqueId('#gallery_'),
    cover: s6,
    name: chance.sentence({ words: 3 }),
    time: sub(new Date(), { days: 7, hours: 6, minutes: 20 }),
  },
  {
    id: uniqueId('#gallery_'),
    cover: s7,
    name: chance.sentence({ words: 3 }),
    time: sub(new Date(), { days: 6, hours: 6, minutes: 20 }),
  },
  {
    id: uniqueId('#gallery_'),
    cover: s8,
    name: chance.sentence({ words: 3 }),
    time: sub(new Date(), { days: 5, hours: 6, minutes: 20 }),
  },
  {
    id: uniqueId('#gallery_'),
    cover: s9,
    name: chance.sentence({ words: 3 }),
    time: sub(new Date(), { days: 4, hours: 6, minutes: 20 }),
  },
  {
    id: uniqueId('#gallery_'),
    cover: s10,
    name: chance.sentence({ words: 3 }),
    time: sub(new Date(), { days: 3, hours: 6, minutes: 20 }),
  },
  {
    id: uniqueId('#gallery_'),
    cover: s11,
    name: chance.sentence({ words: 3 }),
    time: sub(new Date(), { days: 2, hours: 6, minutes: 20 }),
  },
  {
    id: uniqueId('#gallery_'),
    cover: s12,
    name: chance.sentence({ words: 3 }),
    time: sub(new Date(), { days: 1, hours: 6, minutes: 20 }),
  },
];
export const UserDataHandlers = [
  // Mock GET request to retrieve user data
  http.get('/api/data/users', () => {
    try {
      return HttpResponse.json({ status: 200, msg: 'Success', data: users });
    } catch (error) {
      return HttpResponse.json({ status: 200, msg: 'Internal server error', error });
    }
  }),

  // Mock GET request to retrieve gallery data
  http.get('/api/data/gallery', () => {
    try {
      return HttpResponse.json({ status: 200, msg: 'Success', data: gallery });
    } catch (error) {
      return HttpResponse.json({ status: 200, msg: 'Internal server error', error });
    }
  }),
];
