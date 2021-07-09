import React from 'react';
import { color, Flex, FlexProps, Grid, Spinner } from '@stacks/ui';
import { Section } from '@components/section';
import { HoverableItem } from '@components/hoverable';
import { useBlocksList } from './hooks';
import { Caption } from '@components/typography';
import { BlockItem } from './block-list-item';
import { MicroblockItem } from './microblock-list-item';

export const BlocksList: React.FC<FlexProps & { limit?: number }> = ({ limit, ...props }) => {
  const result = useBlocksList(limit);
  if (!result) return null;
  const blocks = result?.pages[0];
  const hasBlocks = blocks?.results?.length;
  const items = limit ? blocks?.results.slice(0, limit) : blocks?.results;
  return (
    <Section title="Recent Blocks" {...props}>
      <Flex flexDirection="column" flexGrow={1} px="loose">
        {hasBlocks ? (
          items?.map((block, index: number, arr: any) => {
            return (
              <>
                <HoverableItem
                  key={`blocks-list-${block.height}`}
                  isLast={index === blocks.results?.length - 1}
                >
                  <BlockItem block={block} index={index} length={arr.length} />
                </HoverableItem>
                {block.microblocks_accepted.map((microblockHash: string, key: number, arr: any) => {
                  return (
                    <HoverableItem
                      key={`microblocks-list-${microblockHash}`}
                      isLast={key === arr.length - 1}
                    >
                      <MicroblockItem
                        blockTime={block.burn_block_time}
                        hash={microblockHash}
                        index={key}
                        length={arr.length}
                      />
                    </HoverableItem>
                  );
                })}
              </>
            );
          })
        ) : (
          <Grid alignContent="center" flexGrow={1} px="base" py="64px" placeItems="center">
            <Spinner size="lg" color={color('text-caption')} />
            <Caption mt="extra-loose" maxWidth="38ch">
              Blocks should start streaming in soon.
            </Caption>
          </Grid>
        )}
      </Flex>
    </Section>
  );
};
