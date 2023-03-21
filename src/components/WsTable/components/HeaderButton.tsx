import { paramIsset } from '../utils/tools';
import WsButton from '../../WsButton';
import type { HeaderWsButtonProps,HeaderButtonProps } from '../types';

const HeaderButton = (props: HeaderButtonProps) => {

  const btns = paramIsset(props.btns, []);
  return (
    <>
      {btns
      .filter((btn:HeaderWsButtonProps)=>{if(btn.align===undefined){ btn.align='right'} return btn.align===props.align})
      .map((btn: HeaderWsButtonProps, index: number) => initBtns(btn, index))}
    </>
  );
}

//生成button
const initBtns = (btn: HeaderWsButtonProps, index: number) => {
  const {align, ...btnConfig} = btn
  return (
    <div key={'Button'+index.toString()}>
      <WsButton
        {...btnConfig}
        type='primary'
        key={index}
      />
    </div>
  );
};

export default HeaderButton;