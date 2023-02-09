enum Buckets {
    bucket,
}

type Bucket = { [K in Buckets]: { type: K; bucket: string } };

const pass: Bucket = [
    {
        type: Buckets.bucket,
        bucket: '[{"name":"test1","keys":{"read":"","upload":"key_test","delete":"abcd"}}]',
    },
];
export default pass;
