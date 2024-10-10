import React from "react";
import Image from "react-bootstrap/Image";
import Spinner from "./../../assets/gifs/spinner.gif";
import { ImageHolder } from "./styledComponents";

interface ILoadingProps {
  width?: string;
  height?: string;
}

const Loading: React.FC<ILoadingProps> = ({ width, height }: ILoadingProps) => {
  return (
    <ImageHolder>
      <Image src={Spinner} width={width} height={height} />
    </ImageHolder>
  );
};

export default Loading;
