// export enum Buckets {
//     bucket = '{"name":"test1","keys":{"read":"","upload":"key_test","delete":"abcd"}}',
// }
// "[{"name":"test1","keys":{"read":"","upload":"key_test","delete":"abcd"}}]"

enum Buckets {
    bucket,
    bucket2,
}

type Bucket = { [K in Buckets]: { type: K; bucket: string } };

const pass: Bucket = [
    {
        type: Buckets.bucket,
        bucket: '[{"name":"test1","keys":{"read":"","upload":"key_test","delete":"abcd"}}]',
    },
    {
        type: Buckets.bucket2,
        bucket: '[{"name":"test1","keys":{"read":"","upload":"key_test","delete":"abcd"}}]',
    },
];
console.log(pass[1].bucket);
