import http from 'k6/http';

import { check, sleep } from 'k6';

import { Rate } from 'k6/metrics';

export let errorRate = new Rate('errors');

export let options = {
    stages: [
        { duration: '5s', target: 10 },
        //{ duration: '5s', target: 10 },
        //{ duration: '5s', target: 10 },
    ],

    treshold : {
        errors: ['rate<0.1'],
        http_req_duration: ['p(90)<1500'], // 90% of requests must complete below 1.5s
    },
}

export default function(){
    let responce = http.get('https://todomvc.com/examples/vue/')
    
    const check = check(responce, {
            'is responce status is 200 :' : (r)=> r.status === 200,
        })

    sleep(1);
 
    errorRate.add(!check);
}