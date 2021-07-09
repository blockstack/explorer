import React from 'react';
import Link from 'next/link';

export const TxLink: React.FC<{ txid: string }> = React.memo(({ txid, ...rest }) => (
  <Link href={`/txid/${txid}`} passHref {...rest} />
));

export const MicroblockLink: React.FC<{ hash: string }> = React.memo(({ hash, ...rest }) => (
  <Link href={`/microblock/${hash}`} passHref {...rest} />
));

export const BlockLink: React.FC<{ hash: string }> = React.memo(({ hash, ...rest }) => (
  <Link href={`/block/${hash}`} passHref {...rest} />
));

export const AddressLink: React.FC<{ principal: string }> = React.memo(({ principal, ...rest }) =>
  principal.includes('.') ? (
    <TxLink txid={principal} {...rest} />
  ) : (
    <Link href={`/address/${principal}`} passHref {...rest} />
  )
);
