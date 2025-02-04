import dynamic from 'next/dynamic';

const ModelLoader = dynamic(() => import('./ModelLoader'), { ssr: false });

export default ModelLoader;