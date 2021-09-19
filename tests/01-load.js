import http from 'k6/http';
import { check } from 'k6';

import { Rate } from 'k6/metrics';

export let errorRate = new Rate('errors');

export let options = {
    thresholds : {
        errors: ['rate<0.1'],
        http_req_duration: ['p(90)<1500']
    },

    stages: [
        { target: 10, duration: '5s'},
        { target: 30, duration: '10s'},
        { target: 30, duration: '10s' },
        { target: 0, duration: '5s' },
    ]
}

export default function(){
    let responce = http.get('https://todomvc.com/examples/vue/')

    const check1 = check(responce, {
            'is responce status is 200 :' : (r)=> r.status === 200,
        })
    errorRate.add(!check1);
}