import OriginalMDXComponents from '@theme-original/MDXComponents';

const Img = (props) => <img {...props} loading="lazy" />;

export default {
  ...OriginalMDXComponents,
  img: Img,
};
