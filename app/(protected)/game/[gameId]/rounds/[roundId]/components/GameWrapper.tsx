import Box from "@/app/ui/components/Box/Box";

export default function GameWrapper({ children }: { children: React.ReactNode }) {
  return (
    <Box paddingInline={12} paddingBlock={16} marginInline="auto" maxWidth="650px" overflow="auto">
      {children}
    </Box>
  );
}
